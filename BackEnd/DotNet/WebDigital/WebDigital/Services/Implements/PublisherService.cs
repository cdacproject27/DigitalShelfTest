using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class PublisherService : IPublisherService
    {
        private readonly BookwormfinalBackupContext _context;

        public PublisherService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<PublisherDto>> GetAll()
        {
            return await _context.Publishers
                .OrderBy(p => p.Name)
                .Select(p => new PublisherDto
                {
                    PublisherId = p.PublisherId,
                    Name = p.Name,
                    Email = p.Email
                })
                .ToListAsync();
        }

        public async Task<int> Create(PublisherCreateDto dto)
        {
            var publisher = new Publisher
            {
                Name = dto.Name,
                Email = dto.Email
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            return publisher.PublisherId;
        }
    }
}