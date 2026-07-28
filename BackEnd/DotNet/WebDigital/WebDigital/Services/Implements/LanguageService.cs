using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class LanguageService : ILanguageService
    {
        private readonly BookwormfinalBackupContext _context;

        public LanguageService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<LanguageDto>> GetAll()
        {
            return await _context.Languages
                .OrderBy(l => l.LanguageDesc)
                .Select(l => new LanguageDto
                {
                    LanguageId = l.LanguageId,
                    LanguageDesc = l.LanguageDesc
                })
                .ToListAsync();
        }

        public async Task<int> Create(LanguageCreateDto dto)
        {
            var language = new Language
            {
                LanguageDesc = dto.LanguageDesc
            };

            _context.Languages.Add(language);
            await _context.SaveChangesAsync();

            return language.LanguageId;
        }
    }
}