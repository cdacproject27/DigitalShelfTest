namespace WebDigital.dto
{
    public class ProductDetailDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string ProductIsbn { get; set; } = null!;

        public string? ProductDescriptionShort { get; set; }

        public string? ProductDescriptionLong { get; set; }

        public string? ProductImage { get; set; }

        public decimal ProductBaseprice { get; set; }

        public decimal? ProductOfferprice { get; set; }

        public DateOnly? ProductOffPriceExpirydate { get; set; }

        public decimal? DiscountPercent { get; set; }

        public decimal? RentPerDay { get; set; }

        public int? MinRentDays { get; set; }

        public bool IsRentable { get; set; }

        public bool IsLibrary { get; set; }

        public string? AuthorName { get; set; }

        public string? GenreName { get; set; }

        public string? LanguageName { get; set; }

        public string? PublisherName { get; set; }

        public string? TypeName { get; set; }
    }
}