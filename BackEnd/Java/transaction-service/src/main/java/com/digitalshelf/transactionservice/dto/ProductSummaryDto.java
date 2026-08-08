package com.digitalshelf.transactionservice.dto;

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
public class ProductSummaryDto {
    private Integer productId;
    private String productName;
    private String productImage;
    private BigDecimal productBaseprice;
    private BigDecimal productOfferprice;
    private BigDecimal rentPerDay;
    
    @JsonProperty("isRentable")
    private boolean isRentable;
}