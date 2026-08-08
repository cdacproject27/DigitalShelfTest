package com.digitalshelf.transactionservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_shelf")
@Data
public class MyShelf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shelf_id")
    private Integer shelfId;

    @Column(name = "product_expiry_date")
    private LocalDateTime productExpiryDate;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "user_id")
    private Integer userId;
}