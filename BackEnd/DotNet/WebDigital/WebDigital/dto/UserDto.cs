namespace WebDigital.dto
{
    public class UserDto
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string UserEmail { get; set; }

        public string? UserPhone { get; set; }

        public string? UserAddress { get; set; }

        public string? Token { get; set; }

        public string? Role { get; set; }
    }
}