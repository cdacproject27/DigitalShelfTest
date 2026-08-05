package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.GenreCreateDto;
import com.digitalshelf.productservice.dto.GenreDto;
import com.digitalshelf.productservice.entity.Genere;
import com.digitalshelf.productservice.repository.GenereRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenereRepository genereRepository;

    public List<GenreDto> getAll() {
        return genereRepository.findAll().stream()
                .sorted(Comparator.comparing(Genere::getGenereDesc))
                .map(g -> GenreDto.builder().genreId(g.getGenereId()).genreDesc(g.getGenereDesc()).build())
                .toList();
    }

    public Integer create(GenreCreateDto dto) {
        Genere genre = new Genere();
        genre.setGenereDesc(dto.getGenreDesc());
        genereRepository.save(genre);
        return genre.getGenereId();
    }
}