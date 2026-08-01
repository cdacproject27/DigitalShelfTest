namespace WebDigital.dto
{
    // Sent to trigger checkout
    public class CheckoutDto
    {
        // "BUY" or "RENT"
        public string TransactionType { get; set; } = null!;

        // Required only when TransactionType is "RENT"
        public int? RentDays { get; set; }
    }

    // One line item inside a transaction
    public class TransactionItemDto
    {
        public int ItemId { get; set; }

        public int? ProductId { get; set; }

        public string? ProductName { get; set; }

        public decimal? Price { get; set; }

        public int? Quantity { get; set; }
    }

    // Summary shown in the user's order history list
    public class TransactionSummaryDto
    {
        public long TransactionId { get; set; }

        public DateTime? CreatedAt { get; set; }

        public string? Status { get; set; }

        public decimal? TotalAmount { get; set; }

        public string? TransactionType { get; set; }
    }

    // Full detail for a single order
    public class TransactionDetailDto : TransactionSummaryDto
    {
        public List<TransactionItemDto> Items { get; set; } = new();
    }
}