using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Exceptions;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class MyShelfService : IMyShelfService
    {
        private readonly BookwormfinalBackupContext _context;

        public MyShelfService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<MyShelfItemDto>> GetMyShelf(int userId)
        {
            var shelfEntries = await _context.MyShelves
                .Include(s => s.Product)
                    .ThenInclude(p => p.PdfBooks)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            var now = DateTime.UtcNow;

            return shelfEntries.Select(s => new MyShelfItemDto
            {
                ShelfId = s.ShelfId,
                ProductId = s.ProductId,
                ProductName = s.Product.ProductName,
                ProductImage = s.Product.ProductImage,
                ProductExpiryDate = s.ProductExpiryDate,
                IsExpired = s.ProductExpiryDate.HasValue && s.ProductExpiryDate.Value < now,
                HasPdfAvailable = s.Product.PdfBooks.Any()
            }).ToList();
        }

        public async Task<PdfBook> GetBookForReading(int userId, int productId)
        {
            // Step 1: does this user actually have a shelf entry for this product at all?
            var shelfEntry = await _context.MyShelves
                .FirstOrDefaultAsync(s => s.UserId == userId && s.ProductId == productId);

            if (shelfEntry == null)
                throw new NotFoundException("You do not own or rent this book.");

            // Step 2: if it was a rental, has it expired?
            if (shelfEntry.ProductExpiryDate.HasValue && shelfEntry.ProductExpiryDate.Value < DateTime.UtcNow)
                throw new BadRequestException("Your access to this book has expired.");

            // Step 3: does the actual PDF file even exist for this product?
            var pdfBook = await _context.PdfBooks
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (pdfBook == null || pdfBook.PdfData == null)
                throw new NotFoundException("No readable file is available for this book.");

            return pdfBook;
        }
    }
}