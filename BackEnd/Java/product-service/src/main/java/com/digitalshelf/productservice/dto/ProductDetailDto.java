package com.digitalshelf.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Integer productId;
    private String productName;
    private String productIsbn;
    private String productDescriptionShort;
    private String productDescriptionLong;
    private String productImage;
    private BigDecimal productBaseprice;
    private BigDecimal productOfferprice;
    private LocalDate productOffPriceExpirydate;
    private BigDecimal discountPercent;
    private BigDecimal rentPerDay;
    private Integer minRentDays;
    private boolean isRentable;
    private boolean isLibrary;

    private String authorName;
    private String genreName;
    private String languageName;
    private String publisherName;
    private String typeName;

    private Integer authorId;
    private Integer genreId;
    private Integer languageId;
    private Integer publisherId;
    private Integer typeId;
}