package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.Genere;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenereRepository extends JpaRepository<Genere, Integer> {
}