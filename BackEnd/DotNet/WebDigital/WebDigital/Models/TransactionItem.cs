using System;
using System.Collections.Generic;

namespace WebDigital.Models;

public partial class TransactionItem
{
    public int ItemId { get; set; }

    public decimal? Price { get; set; }

    public int? Quantity { get; set; }

    public int? ProductId { get; set; }

    public long? TransactionId { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Transaction? Transaction { get; set; }
}
