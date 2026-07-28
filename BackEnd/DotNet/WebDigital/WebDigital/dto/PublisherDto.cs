namespace WebDigital.dto
{
    public class PublisherDto
    {
        public int PublisherId { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;
    }

    public class PublisherCreateDto
    {
        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;
    }
}