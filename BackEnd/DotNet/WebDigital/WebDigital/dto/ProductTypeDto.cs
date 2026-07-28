namespace WebDigital.dto
{
    public class ProductTypeDto
    {
        public int TypeId { get; set; }

        public string? TypeDesc { get; set; }
    }

    public class ProductTypeCreateDto
    {
        public string TypeDesc { get; set; } = null!;
    }
}