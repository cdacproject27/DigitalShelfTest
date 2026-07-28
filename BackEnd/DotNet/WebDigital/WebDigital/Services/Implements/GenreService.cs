using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class GenreService : IGenreService
    {
        private readonly BookwormfinalBackupContext _context;

        public GenreService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<GenreDto>> GetAll()
        {
            return await _context.Generes
                .OrderBy(g => g.GenereDesc)
                .Select(g => new GenreDto
                {
                    GenreId = g.GenereId,
                    GenreDesc = g.GenereDesc
                })
                .ToListAsync();
        }

        public async Task<int> Create(GenreCreateDto dto)
        {
            var genre = new Genere
            {
                GenereDesc = dto.GenreDesc
            };

            _context.Generes.Add(genre);
            await _context.SaveChangesAsync();

            return genre.GenereId;
        }
    }
}