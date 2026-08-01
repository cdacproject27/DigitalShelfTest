using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Exceptions;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class TransactionService : ITransactionService
    {
        private readonly BookwormfinalBackupContext _context;

        private const string CompletedStatus = "COMPLETED";

        public TransactionService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<TransactionDetailDto> Checkout(int userId, CheckoutDto dto)
        {
            var transactionType = dto.TransactionType?.Trim().ToUpper();

            if (transactionType != "BUY" && transactionType != "RENT")
                throw new BadRequestException("TransactionType must be either 'BUY' or 'RENT'.");

            if (transactionType == "RENT" && (!dto.RentDays.HasValue || dto.RentDays <= 0))
                throw new BadRequestException("RentDays is required and must be greater than 0 when renting.");

            var cartItems = await _context.Carts
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (cartItems.Count == 0)
                throw new BadRequestException("Your cart is empty.");

            if (transactionType == "RENT")
            {
                var nonRentable = cartItems.Where(c => c.Product.IsRentable != 1).ToList();
                if (nonRentable.Any())
                {
                    var names = string.Join(", ", nonRentable.Select(c => c.Product.ProductName));
                    throw new BadRequestException($"These items are not rentable: {names}");
                }
            }

            // Everything below must succeed together, or none of it should be saved
            var strategy = _context.Database.CreateExecutionStrategy();

            long newTransactionId = 0;

            await strategy.ExecuteAsync(async () =>
            {
                await using var dbTransaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    decimal totalAmount = 0;
                    var transactionItems = new List<TransactionItem>();

                    foreach (var cartItem in cartItems)
                    {
                        decimal unitPrice = transactionType == "RENT"
                            ? (cartItem.Product.RentPerDay ?? 0) * dto.RentDays!.Value
                            : (cartItem.Product.ProductOfferprice ?? cartItem.Product.ProductBaseprice);

                        totalAmount += unitPrice * cartItem.Qty;

                        transactionItems.Add(new TransactionItem
                        {
                            ProductId = cartItem.ProductId,
                            Price = unitPrice,
                            Quantity = cartItem.Qty
                        });
                    }

                    var transaction = new Transaction
                    {
                        CreatedAt = DateTime.UtcNow,
                        Status = CompletedStatus,
                        TotalAmount = totalAmount,
                        TransactionType = transactionType,
                        UserId = userId
                    };

                    _context.Transactions.Add(transaction);
                    await _context.SaveChangesAsync(); // needed to generate TransactionId

                    foreach (var item in transactionItems)
                    {
                        item.TransactionId = transaction.TransactionId;
                    }
                    _context.TransactionItems.AddRange(transactionItems);

                    // Add or extend My Shelf entries
                    foreach (var cartItem in cartItems)
                    {
                        var shelfEntry = await _context.MyShelves
                            .FirstOrDefaultAsync(s => s.UserId == userId && s.ProductId == cartItem.ProductId);

                        DateTime? expiryDate = transactionType == "RENT"
                            ? DateTime.UtcNow.AddDays(dto.RentDays!.Value)
                            : null; // BUY = owned permanently, no expiry

                        if (shelfEntry == null)
                        {
                            _context.MyShelves.Add(new MyShelf
                            {
                                UserId = userId,
                                ProductId = cartItem.ProductId,
                                ProductExpiryDate = expiryDate
                            });
                        }
                        else
                        {
                       
                            if (transactionType == "RENT")
                            {
                                var baseDate = shelfEntry.ProductExpiryDate.HasValue && shelfEntry.ProductExpiryDate > DateTime.UtcNow
                                    ? shelfEntry.ProductExpiryDate.Value
                                    : DateTime.UtcNow;

                                shelfEntry.ProductExpiryDate = baseDate.AddDays(dto.RentDays!.Value);
                            }
                            else
                            {
                                shelfEntry.ProductExpiryDate = null;
                            }
                        }
                    }

                    _context.Carts.RemoveRange(cartItems);

                    await _context.SaveChangesAsync();
                    await dbTransaction.CommitAsync();

                    newTransactionId = transaction.TransactionId;
                }
                catch
                {
                    await dbTransaction.RollbackAsync();
                    throw;
                }
            });

            return await GetTransactionById(userId, newTransactionId);
        }

        public async Task<List<TransactionSummaryDto>> GetMyTransactions(int userId)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TransactionSummaryDto
                {
                    TransactionId = t.TransactionId,
                    CreatedAt = t.CreatedAt,
                    Status = t.Status,
                    TotalAmount = t.TotalAmount,
                    TransactionType = t.TransactionType
                })
                .ToListAsync();
        }

        public async Task<TransactionDetailDto> GetTransactionById(int userId, long transactionId)
        {
            var transaction = await _context.Transactions
                .Include(t => t.TransactionItems)
                    .ThenInclude(ti => ti.Product)
                .FirstOrDefaultAsync(t => t.TransactionId == transactionId && t.UserId == userId);

            if (transaction == null)
                throw new NotFoundException("Transaction not found.");

            return new TransactionDetailDto
            {
                TransactionId = transaction.TransactionId,
                CreatedAt = transaction.CreatedAt,
                Status = transaction.Status,
                TotalAmount = transaction.TotalAmount,
                TransactionType = transaction.TransactionType,
                Items = transaction.TransactionItems.Select(ti => new TransactionItemDto
                {
                    ItemId = ti.ItemId,
                    ProductId = ti.ProductId,
                    ProductName = ti.Product?.ProductName,
                    Price = ti.Price,
                    Quantity = ti.Quantity
                }).ToList()
            };
        }
    }
}