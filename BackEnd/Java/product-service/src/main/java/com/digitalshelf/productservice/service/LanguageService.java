package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.LanguageCreateDto;
import com.digitalshelf.productservice.dto.LanguageDto;
import com.digitalshelf.productservice.entity.Language;
import com.digitalshelf.productservice.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<LanguageDto> getAll() {
        return languageRepository.findAll().stream()
                .sorted(Comparator.comparing(Language::getLanguageDesc))
                .map(l -> LanguageDto.builder().languageId(l.getLanguageId()).languageDesc(l.getLanguageDesc()).build())
                .toList();
    }

    public Integer create(LanguageCreateDto dto) {
        Language language = new Language();
        language.setLanguageDesc(dto.getLanguageDesc());
        languageRepository.save(language);
        return language.getLanguageId();
    }
}