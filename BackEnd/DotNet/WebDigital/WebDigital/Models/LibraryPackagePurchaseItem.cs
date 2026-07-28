using System;
using System.Collections.Generic;

namespace WebDigital.Models;

public partial class LibraryPackagePurchaseItem
{
    public int ItemId { get; set; }

    public int PurchaseId { get; set; }

    public int ProductId { get; set; }

    public decimal RoyaltyPercent { get; set; }

    public decimal RoyaltyAmount { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual LibraryPackagePurchase Purchase { get; set; } = null!;
}
