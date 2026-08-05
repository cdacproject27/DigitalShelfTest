package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.GenreCreateDto;
import com.digitalshelf.productservice.dto.GenreDto;
import com.digitalshelf.productservice.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<List<GenreDto>> getAll() {
        return ResponseEntity.ok(genreService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> create(@RequestBody GenreCreateDto dto) {
        return ResponseEntity.ok(Map.of("genreId", genreService.create(dto)));
    }
}