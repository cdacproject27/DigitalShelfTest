package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.*;
import com.digitalshelf.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductListDto>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false) Integer languageId,
            @RequestParam(required = false) Integer publisherId,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isRentable,
            @RequestParam(required = false) Boolean isLibrary) {

        return ResponseEntity.ok(productService.getProducts(search, genreId, authorId,
                languageId, publisherId, typeId, minPrice, maxPrice, isRentable, isLibrary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDto> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Internal-only, called by transaction-service's Feign client during checkout
    @GetMapping("/{id}/summary")
    public ResponseEntity<ProductSummaryDto> getProductSummary(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductSummary(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> createProduct(@RequestBody ProductCreateUpdateDto dto) {
        Integer newId = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("productId", newId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable Integer id, @RequestBody ProductCreateUpdateDto dto) {
        productService.updateProduct(id, dto);
        return ResponseEntity.ok("Product updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}