package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.*;
import com.digitalshelf.productservice.entity.*;
import com.digitalshelf.productservice.exception.NotFoundException;
import com.digitalshelf.productservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final AuthorRepository authorRepository;
    private final GenereRepository genereRepository;
    private final LanguageRepository languageRepository;
    private final PublisherRepository publisherRepository;
    private final ProductTypeMasterRepository productTypeMasterRepository;

    public List<ProductListDto> getProducts(String search, Integer genreId, Integer authorId,
            Integer languageId, Integer publisherId, Integer typeId,
            BigDecimal minPrice, BigDecimal maxPrice, Boolean isRentable, Boolean isLibrary) {

        var spec = ProductSpecification.withFilters(search, genreId, authorId, languageId,
                publisherId, typeId, minPrice, maxPrice, isRentable, isLibrary);

        return productRepository.findAll(spec).stream()
                .map(p -> ProductListDto.builder()
                        .productId(p.getProductId())
                        .productName(p.getProductName())
                        .productDescriptionShort(p.getProductDescriptionShort())
                        .productImage(p.getProductImage())
                        .productBaseprice(p.getProductBaseprice())
                        .productOfferprice(p.getProductOfferprice())
                        .discountPercent(p.getDiscountPercent())
                        .isRentable(Boolean.TRUE.equals(p.getIsRentable()))
                        .isLibrary(Boolean.TRUE.equals(p.getIsLibrary()))
                        .authorName(p.getProductAuthor() != null
                                ? authorRepository.findById(p.getProductAuthor()).map(Author::getName).orElse(null)
                                : null)
                        .genreName(p.getProductGenere() != null
                                ? genereRepository.findById(p.getProductGenere()).map(Genere::getGenereDesc).orElse(null)
                                : null)
                        .build())
                .toList();
    }

    public ProductDetailDto getProductById(Integer productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product with id " + productId + " was not found."));

        String authorName = p.getProductAuthor() != null
                ? authorRepository.findById(p.getProductAuthor()).map(Author::getName).orElse(null) : null;
        String genreName = p.getProductGenere() != null
                ? genereRepository.findById(p.getProductGenere()).map(Genere::getGenereDesc).orElse(null) : null;
        String languageName = p.getProductLang() != null
                ? languageRepository.findById(p.getProductLang()).map(Language::getLanguageDesc).orElse(null) : null;
        String publisherName = p.getProductPublisher() != null
                ? publisherRepository.findById(p.getProductPublisher()).map(Publisher::getName).orElse(null) : null;
        String typeName = p.getProductType() != null
                ? productTypeMasterRepository.findById(p.getProductType()).map(ProductTypeMaster::getTypeDesc).orElse(null) : null;

        return ProductDetailDto.builder()
                .productId(p.getProductId())
                .productName(p.getProductName())
                .productIsbn(p.getProductIsbn())
                .productDescriptionShort(p.getProductDescriptionShort())
                .productDescriptionLong(p.getProductDescriptionLong())
                .productImage(p.getProductImage())
                .productBaseprice(p.getProductBaseprice())
                .productOfferprice(p.getProductOfferprice())
                .productOffPriceExpirydate(p.getProductOffPriceExpirydate())
                .discountPercent(p.getDiscountPercent())
                .rentPerDay(p.getRentPerDay())
                .minRentDays(p.getMinRentDays())
                .isRentable(Boolean.TRUE.equals(p.getIsRentable()))
                .isLibrary(Boolean.TRUE.equals(p.getIsLibrary()))
                .authorName(authorName)
                .genreName(genreName)
                .languageName(languageName)
                .publisherName(publisherName)
                .typeName(typeName)
                .authorId(p.getProductAuthor())
                .genreId(p.getProductGenere())
                .languageId(p.getProductLang())
                .publisherId(p.getProductPublisher())
                .typeId(p.getProductType())
                .build();
    }

    // Internal endpoint used by transaction-service's Feign client
    public ProductSummaryDto getProductSummary(Integer productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product with id " + productId + " was not found."));

        return ProductSummaryDto.builder()
                .productId(p.getProductId())
                .productName(p.getProductName())
                .productImage(p.getProductImage())
                .productBaseprice(p.getProductBaseprice())
                .productOfferprice(p.getProductOfferprice())
                .rentPerDay(p.getRentPerDay())
                .isRentable(Boolean.TRUE.equals(p.getIsRentable()))
                .build();
    }

    public Integer createProduct(ProductCreateUpdateDto dto) {
        Product p = mapDtoToEntity(dto, new Product());
        productRepository.save(p);
        return p.getProductId();
    }

    public void updateProduct(Integer productId, ProductCreateUpdateDto dto) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product with id " + productId + " was not found."));
        mapDtoToEntity(dto, p);
        productRepository.save(p);
    }

    public void deleteProduct(Integer productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product with id " + productId + " was not found."));
        productRepository.delete(p);
        // DataIntegrityViolationException (foreign key constraint) is caught globally
        // by GlobalExceptionHandler and turned into a clean 400 message
    }

    private Product mapDtoToEntity(ProductCreateUpdateDto dto, Product p) {
        p.setProductName(dto.getProductName());
        p.setProductIsbn(dto.getProductIsbn());
        p.setProductDescriptionShort(dto.getProductDescriptionShort());
        p.setProductDescriptionLong(dto.getProductDescriptionLong());
        p.setProductImage(dto.getProductImage());
        p.setProductBaseprice(dto.getProductBaseprice());
        p.setProductOfferprice(dto.getProductOfferprice());
        p.setProductOffPriceExpirydate(dto.getProductOffPriceExpirydate());
        p.setDiscountPercent(dto.getDiscountPercent());
        p.setRentPerDay(dto.getRentPerDay());
        p.setMinRentDays(dto.getMinRentDays());
        p.setIsRentable(dto.isRentable());
        p.setIsLibrary(dto.isLibrary());
        p.setRoyaltyPercent(dto.getRoyaltyPercent());
        p.setAttributeId(dto.getAttributeId());
        p.setProductAuthor(dto.getProductAuthor());
        p.setProductGenere(dto.getProductGenere());
        p.setProductLang(dto.getProductLang());
        p.setProductType(dto.getProductType());
        p.setProductPublisher(dto.getProductPublisher());
        return p;
    }
}