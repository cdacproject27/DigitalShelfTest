using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WebDigital.Exceptions;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class PdfBookService : IPdfBookService
    {
        private readonly BookwormfinalBackupContext _context;

     
        private const long MaxFileSizeBytes = 50 * 1024 * 1024;

        public PdfBookService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task UploadPdf(int productId, IFormFile file)
        {
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == productId);
            if (!productExists)
                throw new NotFoundException($"Product with id {productId} was not found.");

            if (file == null || file.Length == 0)
                throw new BadRequestException("No file was uploaded.");

            if (file.Length > MaxFileSizeBytes)
                throw new BadRequestException("File is too large. Maximum size is 50 MB.");

            var extension = Path.GetExtension(file.FileName);
            if (!string.Equals(extension, ".pdf", StringComparison.OrdinalIgnoreCase))
                throw new BadRequestException("Only PDF files are allowed.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            // Upsert: replace the existing PDF for this product if one exists, otherwise create new
            var existing = await _context.PdfBooks.FirstOrDefaultAsync(p => p.ProductId == productId);

            if (existing != null)
            {
                existing.FileName = file.FileName;
                existing.PdfData = fileBytes;
            }
            else
            {
                _context.PdfBooks.Add(new PdfBook
                {
                    ProductId = productId,
                    FileName = file.FileName,
                    PdfData = fileBytes
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasPdf(int productId)
        {
            return await _context.PdfBooks.AnyAsync(p => p.ProductId == productId);
        }

        public async Task DeletePdf(int productId)
        {
            var existing = await _context.PdfBooks.FirstOrDefaultAsync(p => p.ProductId == productId);

            if (existing == null)
                throw new NotFoundException("No PDF found for this product.");

            _context.PdfBooks.Remove(existing);
            await _context.SaveChangesAsync();
        }
    }
}