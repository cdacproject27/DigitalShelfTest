using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IGenreService
    {
        Task<List<GenreDto>> GetAll();

        Task<int> Create(GenreCreateDto dto);
    }
}