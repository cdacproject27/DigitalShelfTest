using System;
using System.Collections.Generic;

namespace WebDigital.Models;

public partial class LibraryPackage
{
    public int PackageId { get; set; }

    public int? BookLimit { get; set; }

    public decimal Cost { get; set; }

    public string Description { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int? ValidityDays { get; set; }

    public virtual ICollection<LibraryPackagePurchase> LibraryPackagePurchases { get; set; } = new List<LibraryPackagePurchase>();

    public virtual ICollection<MyLibrary> MyLibraries { get; set; } = new List<MyLibrary>();
}
