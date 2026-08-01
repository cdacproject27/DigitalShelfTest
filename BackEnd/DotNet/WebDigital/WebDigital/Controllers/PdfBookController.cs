using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/products/{productId}/pdf")]
    [Authorize(Roles = "ADMIN")] // only admins can upload/manage book files
    public class PdfBookController : ControllerBase
    {
        private readonly IPdfBookService _service;

        public PdfBookController(IPdfBookService service)
        {
            _service = service;
        }

        [HttpPost]
        [RequestSizeLimit(50 * 1024 * 1024)] // 50 MB, matches PdfBookService's own check
        public async Task<IActionResult> UploadPdf(int productId, IFormFile file)
        {
            await _service.UploadPdf(productId, file);
            return Ok("PDF uploaded successfully");
        }

        [HttpGet("exists")]
        public async Task<IActionResult> HasPdf(int productId)
        {
            var exists = await _service.HasPdf(productId);
            return Ok(new { hasPdf = exists });
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePdf(int productId)
        {
            await _service.DeletePdf(productId);
            return Ok("PDF removed successfully");
        }
    }
}