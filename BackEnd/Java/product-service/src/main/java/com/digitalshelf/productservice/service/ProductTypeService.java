package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.dto.ProductTypeCreateDto;
import com.digitalshelf.productservice.dto.ProductTypeDto;
import com.digitalshelf.productservice.entity.ProductTypeMaster;
import com.digitalshelf.productservice.repository.ProductTypeMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductTypeService {

    private final ProductTypeMasterRepository productTypeMasterRepository;

    public List<ProductTypeDto> getAll() {
        return productTypeMasterRepository.findAll().stream()
                .sorted(Comparator.comparing(ProductTypeMaster::getTypeDesc))
                .map(t -> ProductTypeDto.builder().typeId(t.getTypeId()).typeDesc(t.getTypeDesc()).build())
                .toList();
    }

    public Integer create(ProductTypeCreateDto dto) {
        ProductTypeMaster type = new ProductTypeMaster();
        type.setTypeDesc(dto.getTypeDesc());
        productTypeMasterRepository.save(type);
        return type.getTypeId();
    }
}