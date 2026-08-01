namespace WebDigital.dto
{
    // What the frontend sees when viewing the cart — joined with product info
    public class CartItemDto
    {
        public int CartId { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? ProductImage { get; set; }

        public decimal ProductBaseprice { get; set; }

        public decimal? ProductOfferprice { get; set; }

        public int Qty { get; set; }

        public decimal LineTotal { get; set; }

        public bool IsRentable { get; set; }
    }

    // Sent when adding an item to the cart
    public class CartAddDto
    {
        public int ProductId { get; set; }

        public int Qty { get; set; } = 1;
    }

    // Sent when updating an existing cart line's quantity
    public class CartUpdateDto
    {
        public int Qty { get; set; }
    }
}