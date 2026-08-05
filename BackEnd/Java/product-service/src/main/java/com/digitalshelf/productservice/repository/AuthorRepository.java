package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Integer> {
}