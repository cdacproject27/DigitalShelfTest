using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.dto;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    [Authorize] // any logged-in user
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service)
        {
            _service = service;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            return int.Parse(userIdClaim!.Value);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckoutDto dto)
        {
            var userId = GetCurrentUserId();
            var result = await _service.Checkout(userId, dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyTransactions()
        {
            var userId = GetCurrentUserId();
            var transactions = await _service.GetMyTransactions(userId);
            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById(long id)
        {
            var userId = GetCurrentUserId();
            var transaction = await _service.GetTransactionById(userId, id);
            return Ok(transaction);
        }
    }
}