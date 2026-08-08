package com.digitalshelf.transactionservice.service;

import com.digitalshelf.transactionservice.client.ProductClient;
import com.digitalshelf.transactionservice.dto.MyShelfItemDto;
import com.digitalshelf.transactionservice.entity.MyShelf;
import com.digitalshelf.transactionservice.exception.BadRequestException;
import com.digitalshelf.transactionservice.exception.NotFoundException;
import com.digitalshelf.transactionservice.repository.MyShelfRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MyShelfService {

    private final MyShelfRepository myShelfRepository;
    private final ProductClient productClient;
    private final RestTemplate loadBalancedRestTemplate; // used just for streaming the PDF bytes (see config below)

    public List<MyShelfItemDto> getMyShelf(Integer userId) {
        return myShelfRepository.findByUserId(userId).stream()
                .map(shelf -> {
                    var product = productClient.getProductSummary(shelf.getProductId());
                    boolean expired = shelf.getProductExpiryDate() != null
                            && shelf.getProductExpiryDate().isBefore(LocalDateTime.now());

                    return MyShelfItemDto.builder()
                            .shelfId(shelf.getShelfId())
                            .productId(shelf.getProductId())
                            .productName(product.getProductName())
                            .productImage(product.getProductImage())
                            .productExpiryDate(shelf.getProductExpiryDate())
                            .isExpired(expired)
                            .hasPdfAvailable(true) // simplified for now -- see note below
                            .build();
                })
                .toList();
    }

    public byte[] getBookForReading(Integer userId, Integer productId) {
        MyShelf shelfEntry = myShelfRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new NotFoundException("You do not own or rent this book."));

        if (shelfEntry.getProductExpiryDate() != null
                && shelfEntry.getProductExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Your access to this book has expired.");
        }

        // Streams the PDF bytes from product-service (which owns pdf_book) via a
        // direct load-balanced call through Eureka -- Feign isn't used here since
        // Feign's default setup handles JSON, not raw binary streams, cleanly.
        try {
            return loadBalancedRestTemplate.getForObject(
                    "http://product-service/api/products/" + productId + "/pdf/raw", byte[].class);
        } catch (Exception e) {
            throw new NotFoundException("No readable file is available for this book.");
        }
    }
}