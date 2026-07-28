using WebDigital.dto;
using WebDigital.Models;
using WebDigital.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace WebDigital.Services.Implements
{
    public class UserService : IUserService
    {
        private readonly BookwormfinalBackupContext _context;
        private readonly TokenService _tokenService;

        public UserService(BookwormfinalBackupContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task Register(RegisterDto dto)
        {
            // Hash the password before storing it — never store plain text passwords
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            User user = new User
            {
                UserName = dto.UserName,
                UserEmail = dto.UserEmail,
                UserPassword = hashedPassword,
                UserPhone = dto.UserPhone,
                UserAddress = dto.UserAddress,
                JoinDate = DateOnly.FromDateTime(DateTime.Now),
                IsAdmin = 0
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();
        }

        public async Task<List<UserDto>> GetAllUsers()
        {
            return await _context.Users
                .Select(x => new UserDto
                {
                    UserId = x.UserId,
                    UserName = x.UserName,
                    UserEmail = x.UserEmail,
                    UserPhone = x.UserPhone,
                    UserAddress = x.UserAddress
                })
                .ToListAsync();
        }

        public async Task<UserDto?> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.UserEmail == dto.UserEmail);

            if (user == null)
                return null;

            // Verify the plain-text password against the stored BCrypt hash
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.UserPassword);

            if (!isPasswordValid)
                return null;

            string token = _tokenService.GenerateToken(user);

            return new UserDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                UserEmail = user.UserEmail,
                UserPhone = user.UserPhone,
                UserAddress = user.UserAddress,
                Token = token,
                Role = (user.IsAdmin == 1) ? "ADMIN" : "USER"
            };
        }
    }
}