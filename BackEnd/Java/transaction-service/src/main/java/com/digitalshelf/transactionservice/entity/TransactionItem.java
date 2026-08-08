package com.digitalshelf.transactionservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "transaction_item")
@Data
public class TransactionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    private BigDecimal price;
    private Integer quantity;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "transaction_id")
    private Long transactionId;
}