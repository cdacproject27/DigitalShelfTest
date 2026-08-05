package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.PdfBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PdfBookRepository extends JpaRepository<PdfBook, Integer> {
    Optional<PdfBook> findByProductId(Integer productId);
    boolean existsByProductId(Integer productId);
}