package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.AuthorCreateDto;
import com.digitalshelf.productservice.dto.AuthorDto;
import com.digitalshelf.productservice.entity.Author;
import com.digitalshelf.productservice.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<AuthorDto> getAll() {
        return authorRepository.findAll().stream()
                .sorted(Comparator.comparing(Author::getName))
                .map(a -> AuthorDto.builder().authorId(a.getAuthorId()).name(a.getName()).bio(a.getBio()).build())
                .toList();
    }

    public Integer create(AuthorCreateDto dto) {
        Author author = new Author();
        author.setName(dto.getName());
        author.setBio(dto.getBio());
        authorRepository.save(author);
        return author.getAuthorId();
    }
}