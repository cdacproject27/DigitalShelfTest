using Microsoft.AspNetCore.Http;

namespace WebDigital.Services.Interface
{
    public interface IPdfBookService
    {
        Task UploadPdf(int productId, IFormFile file);

        Task<bool> HasPdf(int productId);

        Task DeletePdf(int productId);
    }
}