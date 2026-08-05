package com.digitalshelf.productservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_isbn")
    private String productIsbn;

    @Column(name = "product_description_short")
    private String productDescriptionShort;

    @Column(name = "product_description_long", columnDefinition = "TEXT")
    private String productDescriptionLong;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "product_baseprice")
    private BigDecimal productBaseprice;

    @Column(name = "product_offerprice")
    private BigDecimal productOfferprice;

    @Column(name = "product_off_price_expirydate")
    private LocalDate productOffPriceExpirydate;

    @Column(name = "discount_percent")
    private BigDecimal discountPercent;

    @Column(name = "rent_per_day")
    private BigDecimal rentPerDay;

    @Column(name = "min_rent_days")
    private Integer minRentDays;

    @Column(name = "is_rentable")
    private Boolean isRentable;

    @Column(name = "is_library")
    private Boolean isLibrary;

    @Column(name = "royalty_percent")
    private BigDecimal royaltyPercent;

    @Column(name = "attribute_id")
    private Integer attributeId;

    @Column(name = "product_author")
    private Integer productAuthor;

    @Column(name = "product_genere")
    private Integer productGenere;

    @Column(name = "product_lang")
    private Integer productLang;

    @Column(name = "product_type")
    private Integer productType;

    @Column(name = "product_publisher")
    private Integer productPublisher;
}