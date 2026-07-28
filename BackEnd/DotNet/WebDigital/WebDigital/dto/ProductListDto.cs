namespace WebDigital.dto
{
    public class ProductListDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? ProductDescriptionShort { get; set; }

        public string? ProductImage { get; set; }

        public decimal ProductBaseprice { get; set; }

        public decimal? ProductOfferprice { get; set; }

        public decimal? DiscountPercent { get; set; }

        public bool IsRentable { get; set; }

        public bool IsLibrary { get; set; }

        public string? AuthorName { get; set; }

        public string? GenreName { get; set; }
    }
}