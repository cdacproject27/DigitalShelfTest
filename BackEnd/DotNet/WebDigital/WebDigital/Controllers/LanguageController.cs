using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.dto;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/languages")]
    public class LanguageController : ControllerBase
    {
        private readonly ILanguageService _service;

        public LanguageController(ILanguageService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var languages = await _service.GetAll();
            return Ok(languages);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Create(LanguageCreateDto dto)
        {
            var newId = await _service.Create(dto);
            return Ok(new { languageId = newId });
        }
    }
}