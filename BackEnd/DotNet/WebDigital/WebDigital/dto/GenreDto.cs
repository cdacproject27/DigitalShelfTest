namespace WebDigital.dto
{
    public class GenreDto
    {
        public int GenreId { get; set; }

        public string? GenreDesc { get; set; }
    }

    public class GenreCreateDto
    {
        public string GenreDesc { get; set; } = null!;
    }
}