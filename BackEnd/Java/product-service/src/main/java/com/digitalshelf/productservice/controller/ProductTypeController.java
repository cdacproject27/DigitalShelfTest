package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.ProductTypeCreateDto;
import com.digitalshelf.productservice.dto.ProductTypeDto;
import com.digitalshelf.productservice.service.ProductTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-types")
@RequiredArgsConstructor
public class ProductTypeController {

    private final ProductTypeService productTypeService;

    @GetMapping
    public ResponseEntity<List<ProductTypeDto>> getAll() {
        return ResponseEntity.ok(productTypeService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> create(@RequestBody ProductTypeCreateDto dto) {
        return ResponseEntity.ok(Map.of("typeId", productTypeService.create(dto)));
    }
}