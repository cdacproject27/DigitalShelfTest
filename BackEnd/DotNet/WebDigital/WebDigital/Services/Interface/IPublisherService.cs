using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IPublisherService
    {
        Task<List<PublisherDto>> GetAll();

        Task<int> Create(PublisherCreateDto dto);
    }
}