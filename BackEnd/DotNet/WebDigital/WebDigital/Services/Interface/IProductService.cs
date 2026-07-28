using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IProductService
    {
        Task<List<ProductListDto>> GetProducts(ProductFilterDto filter);

        Task<ProductDetailDto> GetProductById(int productId);

        Task<int> CreateProduct(ProductCreateUpdateDto dto);

        Task UpdateProduct(int productId, ProductCreateUpdateDto dto);

        Task DeleteProduct(int productId);
    }
}