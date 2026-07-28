using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.dto;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/genres")]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _service;

        public GenreController(IGenreService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var genres = await _service.GetAll();
            return Ok(genres);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Create(GenreCreateDto dto)
        {
            var newId = await _service.Create(dto);
            return Ok(new { genreId = newId });
        }
    }
}