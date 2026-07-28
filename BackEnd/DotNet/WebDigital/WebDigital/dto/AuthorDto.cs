namespace WebDigital.dto
{
    public class AuthorDto
    {
        public int AuthorId { get; set; }

        public string Name { get; set; } = null!;

        public string? Bio { get; set; }
    }

    public class AuthorCreateDto
    {
        public string Name { get; set; } = null!;

        public string? Bio { get; set; }
    }
}