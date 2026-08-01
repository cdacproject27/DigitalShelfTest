using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/my-shelf")]
    [Authorize] // any logged-in user
    public class MyShelfController : ControllerBase
    {
        private readonly IMyShelfService _service;

        public MyShelfController(IMyShelfService service)
        {
            _service = service;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            return int.Parse(userIdClaim!.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyShelf()
        {
            var userId = GetCurrentUserId();
            var shelf = await _service.GetMyShelf(userId);
            return Ok(shelf);
        }

        // Streams the actual PDF bytes — only if the user genuinely owns/rents it and it's not expired
        [HttpGet("{productId}/read")]
        public async Task<IActionResult> ReadBook(int productId)
        {
            var userId = GetCurrentUserId();
            var pdfBook = await _service.GetBookForReading(userId, productId);

            var fileName = string.IsNullOrWhiteSpace(pdfBook.FileName)
                ? $"book-{productId}.pdf"
                : pdfBook.FileName;

            return File(pdfBook.PdfData!, "application/pdf", fileName);
        }
    }
}