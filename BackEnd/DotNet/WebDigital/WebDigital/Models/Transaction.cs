using System;
using System.Collections.Generic;

namespace WebDigital.Models;

public partial class Transaction
{
    public long TransactionId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Status { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? TransactionType { get; set; }

    public int? UserId { get; set; }

    public virtual ICollection<LibraryPackagePurchase> LibraryPackagePurchases { get; set; } = new List<LibraryPackagePurchase>();

    public virtual ICollection<TransactionItem> TransactionItems { get; set; } = new List<TransactionItem>();

    public virtual User? User { get; set; }
}
