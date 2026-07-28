using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface IUserService
    {
        Task Register(RegisterDto dto);

        Task<UserDto?> Login(LoginDto dto);

        Task<List<UserDto>> GetAllUsers();
    }
}
