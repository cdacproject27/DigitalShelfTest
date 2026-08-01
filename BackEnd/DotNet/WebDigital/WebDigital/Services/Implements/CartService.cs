using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Exceptions;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class CartService : ICartService
    {
        private readonly BookwormfinalBackupContext _context;

        public CartService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<CartItemDto>> GetCart(int userId)
        {
            return await _context.Carts
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .Select(c => new CartItemDto
                {
                    CartId = c.CartId,
                    ProductId = c.ProductId,
                    ProductName = c.Product.ProductName,
                    ProductImage = c.Product.ProductImage,
                    ProductBaseprice = c.Product.ProductBaseprice,
                    ProductOfferprice = c.Product.ProductOfferprice,
                    Qty = c.Qty,
                    LineTotal = (c.Product.ProductOfferprice ?? c.Product.ProductBaseprice) * c.Qty,
                    IsRentable = c.Product.IsRentable == 1
                })
                .ToListAsync();
        }

        public async Task<int> AddToCart(int userId, CartAddDto dto)
        {
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == dto.ProductId);
            if (!productExists)
                throw new NotFoundException($"Product with id {dto.ProductId} was not found.");

            if (dto.Qty < 1)
                throw new BadRequestException("Quantity must be at least 1.");

            // If this product is already in the user's cart, just increase the quantity
            var existing = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

            if (existing != null)
            {
                existing.Qty += dto.Qty;
                await _context.SaveChangesAsync();
                return existing.CartId;
            }

            var cartItem = new Cart
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Qty = dto.Qty
            };

            _context.Carts.Add(cartItem);
            await _context.SaveChangesAsync();

            return cartItem.CartId;
        }

        public async Task UpdateQuantity(int userId, int cartId, CartUpdateDto dto)
        {
            if (dto.Qty < 1)
                throw new BadRequestException("Quantity must be at least 1.");

            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

            if (cartItem == null)
                throw new NotFoundException("Cart item not found.");

            cartItem.Qty = dto.Qty;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveItem(int userId, int cartId)
        {
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

            if (cartItem == null)
                throw new NotFoundException("Cart item not found.");

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task ClearCart(int userId)
        {
            var items = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            _context.Carts.RemoveRange(items);
            await _context.SaveChangesAsync();
        }
    }
}