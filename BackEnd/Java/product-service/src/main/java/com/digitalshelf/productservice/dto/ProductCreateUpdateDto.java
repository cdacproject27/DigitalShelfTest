package com.digitalshelf.productservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductCreateUpdateDto {
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
    private BigDecimal royaltyPercent;
    private Integer attributeId;
    private Integer productAuthor;
    private Integer productGenere;
    private Integer productLang;
    private Integer productType;
    private Integer productPublisher;
}