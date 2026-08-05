package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
}