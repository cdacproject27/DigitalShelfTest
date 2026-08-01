using Microsoft.EntityFrameworkCore;
using WebDigital.dto;
using WebDigital.Exceptions;
using WebDigital.Models;
using WebDigital.Services.Interface;

namespace WebDigital.Services.Implements
{
    public class ProductService : IProductService
    {
        private readonly BookwormfinalBackupContext _context;

        public ProductService(BookwormfinalBackupContext context)
        {
            _context = context;
        }

        public async Task<List<ProductListDto>> GetProducts(ProductFilterDto filter)
        {
            var query = _context.Products
                .Include(p => p.ProductAuthorNavigation)
                .Include(p => p.ProductGenereNavigation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                query = query.Where(p =>
                    p.ProductName.Contains(filter.Search) ||
                    (p.ProductDescriptionShort != null && p.ProductDescriptionShort.Contains(filter.Search)));
            }

            if (filter.GenreId.HasValue)
                query = query.Where(p => p.ProductGenere == filter.GenreId);

            if (filter.AuthorId.HasValue)
                query = query.Where(p => p.ProductAuthor == filter.AuthorId);

            if (filter.LanguageId.HasValue)
                query = query.Where(p => p.ProductLang == filter.LanguageId);

            if (filter.PublisherId.HasValue)
                query = query.Where(p => p.ProductPublisher == filter.PublisherId);

            if (filter.TypeId.HasValue)
                query = query.Where(p => p.ProductType == filter.TypeId);

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.ProductBaseprice >= filter.MinPrice);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.ProductBaseprice <= filter.MaxPrice);

            if (filter.IsRentable.HasValue)
            {
                ulong flag = filter.IsRentable.Value ? 1u : 0u;
                query = query.Where(p => p.IsRentable == flag);
            }

            if (filter.IsLibrary.HasValue)
            {
                ulong flag = filter.IsLibrary.Value ? 1u : 0u;
                query = query.Where(p => p.IsLibrary == flag);
            }

            var page = filter.Page < 1 ? 1 : filter.Page;
            var pageSize = filter.PageSize < 1 ? 20 : filter.PageSize;

            return await query
                .OrderByDescending(p => p.ProductId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductListDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    ProductDescriptionShort = p.ProductDescriptionShort,
                    ProductImage = p.ProductImage,
                    ProductBaseprice = p.ProductBaseprice,
                    ProductOfferprice = p.ProductOfferprice,
                    DiscountPercent = p.DiscountPercent,
                    IsRentable = p.IsRentable == 1,
                    IsLibrary = p.IsLibrary == 1,
                    AuthorName = p.ProductAuthorNavigation != null ? p.ProductAuthorNavigation.Name : null,
                    GenreName = p.ProductGenereNavigation != null ? p.ProductGenereNavigation.GenereDesc : null
                })
                .ToListAsync();
        }

        public async Task<ProductDetailDto> GetProductById(int productId)
        {
            var product = await _context.Products
                .Include(p => p.ProductAuthorNavigation)
                .Include(p => p.ProductGenereNavigation)
                .Include(p => p.ProductLangNavigation)
                .Include(p => p.ProductPublisherNavigation)
                .Include(p => p.ProductTypeNavigation)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new NotFoundException($"Product with id {productId} was not found.");

            return new ProductDetailDto
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                ProductIsbn = product.ProductIsbn,
                ProductDescriptionShort = product.ProductDescriptionShort,
                ProductDescriptionLong = product.ProductDescriptionLong,
                ProductImage = product.ProductImage,
                ProductBaseprice = product.ProductBaseprice,
                ProductOfferprice = product.ProductOfferprice,
                ProductOffPriceExpirydate = product.ProductOffPriceExpirydate,
                DiscountPercent = product.DiscountPercent,
                RentPerDay = product.RentPerDay,
                MinRentDays = product.MinRentDays,
                IsRentable = product.IsRentable == 1,
                IsLibrary = product.IsLibrary == 1,
                AuthorName = product.ProductAuthorNavigation?.Name,
                GenreName = product.ProductGenereNavigation?.GenereDesc,
                LanguageName = product.ProductLangNavigation?.LanguageDesc,
                PublisherName = product.ProductPublisherNavigation?.Name,
                TypeName = product.ProductTypeNavigation?.TypeDesc,
                AuthorId = product.ProductAuthor,
                GenreId = product.ProductGenere,
                LanguageId = product.ProductLang,
                PublisherId = product.ProductPublisher,
                TypeId = product.ProductType
            };
        }

        public async Task<int> CreateProduct(ProductCreateUpdateDto dto)
        {
            var product = new Product
            {
                ProductName = dto.ProductName,
                ProductIsbn = dto.ProductIsbn,
                ProductDescriptionShort = dto.ProductDescriptionShort,
                ProductDescriptionLong = dto.ProductDescriptionLong,
                ProductImage = dto.ProductImage,
                ProductBaseprice = dto.ProductBaseprice,
                ProductOfferprice = dto.ProductOfferprice,
                ProductOffPriceExpirydate = dto.ProductOffPriceExpirydate,
                DiscountPercent = dto.DiscountPercent,
                RentPerDay = dto.RentPerDay,
                MinRentDays = dto.MinRentDays,
                IsRentable = dto.IsRentable ? 1u : 0u,
                IsLibrary = dto.IsLibrary ? 1u : 0u,
                RoyaltyPercent = dto.RoyaltyPercent,
                AttributeId = dto.AttributeId,
                ProductAuthor = dto.ProductAuthor,
                ProductGenere = dto.ProductGenere,
                ProductLang = dto.ProductLang,
                ProductType = dto.ProductType,
                ProductPublisher = dto.ProductPublisher
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return product.ProductId;
        }

        public async Task UpdateProduct(int productId, ProductCreateUpdateDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new NotFoundException($"Product with id {productId} was not found.");

            product.ProductName = dto.ProductName;
            product.ProductIsbn = dto.ProductIsbn;
            product.ProductDescriptionShort = dto.ProductDescriptionShort;
            product.ProductDescriptionLong = dto.ProductDescriptionLong;
            product.ProductImage = dto.ProductImage;
            product.ProductBaseprice = dto.ProductBaseprice;
            product.ProductOfferprice = dto.ProductOfferprice;
            product.ProductOffPriceExpirydate = dto.ProductOffPriceExpirydate;
            product.DiscountPercent = dto.DiscountPercent;
            product.RentPerDay = dto.RentPerDay;
            product.MinRentDays = dto.MinRentDays;
            product.IsRentable = dto.IsRentable ? 1u : 0u;
            product.IsLibrary = dto.IsLibrary ? 1u : 0u;
            product.RoyaltyPercent = dto.RoyaltyPercent;
            product.AttributeId = dto.AttributeId;
            product.ProductAuthor = dto.ProductAuthor;
            product.ProductGenere = dto.ProductGenere;
            product.ProductLang = dto.ProductLang;
            product.ProductType = dto.ProductType;
            product.ProductPublisher = dto.ProductPublisher;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteProduct(int productId)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new NotFoundException($"Product with id {productId} was not found.");

            _context.Products.Remove(product);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new BadRequestException(
                    "This product cannot be deleted because it has related records " +
                    "(e.g. cart items, transactions, royalty calculations, or attributes). Remove those first.");
            }
        }
    }
}
