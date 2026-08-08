package com.digitalshelf.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyShelfItemDto {
    private Integer shelfId;
    private Integer productId;
    private String productName;
    private String productImage;
    private LocalDateTime productExpiryDate;
    private boolean hasPdfAvailable;
    @JsonProperty("isExpired")
    private boolean isExpired;
}