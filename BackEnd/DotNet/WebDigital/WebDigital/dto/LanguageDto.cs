namespace WebDigital.dto
{
    public class LanguageDto
    {
        public int LanguageId { get; set; }

        public string? LanguageDesc { get; set; }
    }

    public class LanguageCreateDto
    {
        public string LanguageDesc { get; set; } = null!;
    }
}