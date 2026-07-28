using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface ILanguageService
    {
        Task<List<LanguageDto>> GetAll();

        Task<int> Create(LanguageCreateDto dto);
    }
}