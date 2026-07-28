namespace WebDigital.dto
{
    // Bound from query string, e.g. GET /api/products?search=harry&genreId=2&page=1
    public class ProductFilterDto
    {
        public string? Search { get; set; }

        public int? GenreId { get; set; }

        public int? AuthorId { get; set; }

        public int? LanguageId { get; set; }

        public int? PublisherId { get; set; }

        public int? TypeId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public bool? IsRentable { get; set; }

        public bool? IsLibrary { get; set; }

        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 20;
    }
}