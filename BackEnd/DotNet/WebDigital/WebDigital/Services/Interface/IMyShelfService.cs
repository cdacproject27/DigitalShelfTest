using WebDigital.dto;
using WebDigital.Models;

namespace WebDigital.Services.Interface
{
    public interface IMyShelfService
    {
        Task<List<MyShelfItemDto>> GetMyShelf(int userId);

        // Returns the PDF entity only if the user genuinely owns/rents it and it hasn't expired.
        // Throws if not found, not owned, or expired — never silently returns someone else's data.
        Task<PdfBook> GetBookForReading(int userId, int productId);
    }
}