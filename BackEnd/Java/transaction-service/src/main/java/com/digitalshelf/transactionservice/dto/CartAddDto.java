package com.digitalshelf.transactionservice.dto;

import lombok.Data;

@Data
public class CartAddDto {
    private Integer productId;
    private Integer qty = 1;
}