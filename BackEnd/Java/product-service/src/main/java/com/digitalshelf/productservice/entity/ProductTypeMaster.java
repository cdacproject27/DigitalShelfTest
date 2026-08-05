package com.digitalshelf.productservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_type_master")
@Data
public class ProductTypeMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Integer typeId;

    @Column(name = "type_desc")
    private String typeDesc;
}