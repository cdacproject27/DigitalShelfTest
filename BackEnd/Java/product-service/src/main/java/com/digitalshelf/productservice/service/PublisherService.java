package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.PublisherCreateDto;
import com.digitalshelf.productservice.dto.PublisherDto;
import com.digitalshelf.productservice.entity.Publisher;
import com.digitalshelf.productservice.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {

    private final PublisherRepository publisherRepository;

    public List<PublisherDto> getAll() {
        return publisherRepository.findAll().stream()
                .sorted(Comparator.comparing(Publisher::getName))
                .map(p -> PublisherDto.builder().publisherId(p.getPublisherId()).name(p.getName()).email(p.getEmail()).build())
                .toList();
    }

    public Integer create(PublisherCreateDto dto) {
        Publisher publisher = new Publisher();
        publisher.setName(dto.getName());
        publisher.setEmail(dto.getEmail());
        publisherRepository.save(publisher);
        return publisher.getPublisherId();
    }
}