using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class AuthorService : IAuthorService
    {
        private readonly BookwormfinalBackupContext _context;

        public AuthorService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<AuthorDto>> GetAll()
        {
            return await _context.Authors
                .OrderBy(a => a.Name)
                .Select(a => new AuthorDto
                {
                    AuthorId = a.AuthorId,
                    Name = a.Name,
                    Bio = a.Bio
                })
                .ToListAsync();
        }

        public async Task<int> Create(AuthorCreateDto dto)
        {
            var author = new Author
            {
                Name = dto.Name,
                Bio = dto.Bio
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return author.AuthorId;
        }
    }
}