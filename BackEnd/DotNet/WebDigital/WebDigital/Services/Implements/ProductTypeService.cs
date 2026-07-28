using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class ProductTypeService : IProductTypeService
    {
        private readonly BookwormfinalBackupContext _context;

        public ProductTypeService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<ProductTypeDto>> GetAll()
        {
            return await _context.ProductTypeMasters
                .OrderBy(t => t.TypeDesc)
                .Select(t => new ProductTypeDto
                {
                    TypeId = t.TypeId,
                    TypeDesc = t.TypeDesc
                })
                .ToListAsync();
        }

        public async Task<int> Create(ProductTypeCreateDto dto)
        {
            var type = new ProductTypeMaster
            {
                TypeDesc = dto.TypeDesc
            };

            _context.ProductTypeMasters.Add(type);
            await _context.SaveChangesAsync();

            return type.TypeId;
        }
    }
}