package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.PublisherCreateDto;
import com.digitalshelf.productservice.dto.PublisherDto;
import com.digitalshelf.productservice.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {

    private final PublisherService publisherService;

    @GetMapping
    public ResponseEntity<List<PublisherDto>> getAll() {
        return ResponseEntity.ok(publisherService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> create(@RequestBody PublisherCreateDto dto) {
        return ResponseEntity.ok(Map.of("publisherId", publisherService.create(dto)));
    }
}