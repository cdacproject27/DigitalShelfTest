namespace WebDigital.dto
{
    public class MyShelfItemDto
    {
        public int ShelfId { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? ProductImage { get; set; }

        public DateTime? ProductExpiryDate { get; set; }

        public bool IsExpired { get; set; }

        public bool HasPdfAvailable { get; set; }
    }
}