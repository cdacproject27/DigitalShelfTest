using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.dto;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize] // any logged-in user (not admin-only)
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }

        // Pulls the current user's id out of the JWT — never trust a client-sent user id
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            return int.Parse(userIdClaim!.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _service.GetCart(userId);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(CartAddDto dto)
        {
            var userId = GetCurrentUserId();
            var cartId = await _service.AddToCart(userId, dto);
            return Ok(new { cartId });
        }

        [HttpPut("{cartId}")]
        public async Task<IActionResult> UpdateQuantity(int cartId, CartUpdateDto dto)
        {
            var userId = GetCurrentUserId();
            await _service.UpdateQuantity(userId, cartId, dto);
            return Ok("Cart item updated");
        }

        [HttpDelete("{cartId}")]
        public async Task<IActionResult> RemoveItem(int cartId)
        {
            var userId = GetCurrentUserId();
            await _service.RemoveItem(userId, cartId);
            return Ok("Cart item removed");
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            await _service.ClearCart(userId);
            return Ok("Cart cleared");
        }
    }
}