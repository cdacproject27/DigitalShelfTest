package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> withFilters(
            String search, Integer genreId, Integer authorId, Integer languageId,
            Integer publisherId, Integer typeId, BigDecimal minPrice, BigDecimal maxPrice,
            Boolean isRentable, Boolean isLibrary) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("productName")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("productDescriptionShort")), "%" + search.toLowerCase() + "%")
                ));
            }
            if (genreId != null) predicates.add(cb.equal(root.get("productGenere"), genreId));
            if (authorId != null) predicates.add(cb.equal(root.get("productAuthor"), authorId));
            if (languageId != null) predicates.add(cb.equal(root.get("productLang"), languageId));
            if (publisherId != null) predicates.add(cb.equal(root.get("productPublisher"), publisherId));
            if (typeId != null) predicates.add(cb.equal(root.get("productType"), typeId));
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("productBaseprice"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("productBaseprice"), maxPrice));
            if (isRentable != null) predicates.add(cb.equal(root.get("isRentable"), isRentable));
            if (isLibrary != null) predicates.add(cb.equal(root.get("isLibrary"), isLibrary));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}