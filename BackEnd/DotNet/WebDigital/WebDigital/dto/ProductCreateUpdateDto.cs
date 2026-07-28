namespace WebDigital.dto
{
    public class ProductCreateUpdateDto
    {
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

        public decimal? RoyaltyPercent { get; set; }

        public int? AttributeId { get; set; }

        public int? ProductAuthor { get; set; }

        public int? ProductGenere { get; set; }

        public int? ProductLang { get; set; }

        public int? ProductType { get; set; }

        public int? ProductPublisher { get; set; }
    }
}