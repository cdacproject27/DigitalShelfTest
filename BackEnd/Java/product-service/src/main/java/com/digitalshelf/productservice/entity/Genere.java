package com.digitalshelf.productservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "genere")
@Data
public class Genere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genere_id")
    private Integer genereId;

    @Column(name = "genere_desc")
    private String genereDesc;
}