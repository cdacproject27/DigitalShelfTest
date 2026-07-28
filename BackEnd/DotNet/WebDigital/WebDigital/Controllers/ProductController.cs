using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDigital.dto;
using WebDigital.Services.Interface;

namespace WebDigital.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        // Public: anyone can browse products, no login required
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
        {
            var products = await _service.GetProducts(filter);
            return Ok(products);
        }

        // Public: anyone can view a single product's detail page
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _service.GetProductById(id);
            return Ok(product);
        }

        // Admin only: create a new product
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct(ProductCreateUpdateDto dto)
        {
            var newId = await _service.CreateProduct(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = newId }, new { productId = newId });
        }

        // Admin only: update an existing product
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductCreateUpdateDto dto)
        {
            await _service.UpdateProduct(id, dto);
            return Ok("Product updated successfully");
        }

        // Admin only: delete a product
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _service.DeleteProduct(id);
            return Ok("Product deleted successfully");
        }
    }
}