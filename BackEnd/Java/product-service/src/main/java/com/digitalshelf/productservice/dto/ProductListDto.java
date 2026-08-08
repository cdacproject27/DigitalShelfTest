package com.digitalshelf.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListDto {
    private Integer productId;
    private String productName;
    private String productDescriptionShort;
    private String productImage;
    private BigDecimal productBaseprice;
    private BigDecimal productOfferprice;
    private BigDecimal discountPercent;
    private String authorName;
    private String genreName;
    
    @JsonProperty("isRentable")
    private boolean isRentable;

    @JsonProperty("isLibrary")
    private boolean isLibrary;
}