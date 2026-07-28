using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IAuthorService
    {
        Task<List<AuthorDto>> GetAll();

        Task<int> Create(AuthorCreateDto dto);
    }
}