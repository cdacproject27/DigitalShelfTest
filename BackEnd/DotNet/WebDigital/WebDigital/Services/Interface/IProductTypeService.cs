using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IProductTypeService
    {
        Task<List<ProductTypeDto>> GetAll();

        Task<int> Create(ProductTypeCreateDto dto);
    }
}