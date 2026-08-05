package com.digitalshelf.productservice.repository;

import com.digitalshelf.productservice.entity.ProductTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductTypeMasterRepository extends JpaRepository<ProductTypeMaster, Integer> {
}