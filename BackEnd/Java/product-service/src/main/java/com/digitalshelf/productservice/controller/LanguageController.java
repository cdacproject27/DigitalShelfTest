package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.LanguageCreateDto;
import com.digitalshelf.productservice.dto.LanguageDto;
import com.digitalshelf.productservice.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public ResponseEntity<List<LanguageDto>> getAll() {
        return ResponseEntity.ok(languageService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> create(@RequestBody LanguageCreateDto dto) {
        return ResponseEntity.ok(Map.of("languageId", languageService.create(dto)));
    }
}