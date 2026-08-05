package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.dto.AuthorCreateDto;
import com.digitalshelf.productservice.dto.AuthorDto;
import com.digitalshelf.productservice.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public ResponseEntity<List<AuthorDto>> getAll() {
        return ResponseEntity.ok(authorService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Integer>> create(@RequestBody AuthorCreateDto dto) {
        return ResponseEntity.ok(Map.of("authorId", authorService.create(dto)));
    }
}