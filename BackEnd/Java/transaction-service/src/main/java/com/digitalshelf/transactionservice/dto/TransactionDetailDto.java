package com.digitalshelf.transactionservice.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class TransactionDetailDto extends TransactionSummaryDto {
    private List<TransactionItemDto> items = new ArrayList<>();
}