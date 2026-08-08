package com.digitalshelf.transactionservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cart")
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    private Integer qty;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "user_id")
    private Integer userId;
}