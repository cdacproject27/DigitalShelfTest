package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, Integer> {
}