package com.digitalshelf.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionItemDto {
    private Integer itemId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}