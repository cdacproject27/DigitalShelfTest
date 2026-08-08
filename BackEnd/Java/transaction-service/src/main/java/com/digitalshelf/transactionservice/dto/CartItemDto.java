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
public class CartItemDto {
    private Integer cartId;
    private Integer productId;
    private String productName;
    private String productImage;
    private BigDecimal productBaseprice;
    private BigDecimal productOfferprice;
    private int qty;
    private BigDecimal lineTotal;
    @JsonProperty("isRentable")
    private boolean isRentable;
}