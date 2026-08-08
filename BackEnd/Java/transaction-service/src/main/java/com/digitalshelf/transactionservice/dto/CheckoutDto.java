package com.digitalshelf.transactionservice.dto;

import lombok.Data;

@Data
public class CheckoutDto {
    private String transactionType;
    private Integer rentDays;
}