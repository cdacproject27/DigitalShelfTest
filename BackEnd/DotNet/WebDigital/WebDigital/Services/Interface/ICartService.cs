using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface ICartService
    {
        Task<List<CartItemDto>> GetCart(int userId);

        Task<int> AddToCart(int userId, CartAddDto dto);

        Task UpdateQuantity(int userId, int cartId, CartUpdateDto dto);

        Task RemoveItem(int userId, int cartId);

        Task ClearCart(int userId);
    }
}