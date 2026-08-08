package com.digitalshelf.transactionservice.client;

import com.digitalshelf.transactionservice.dto.ProductSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// "product-service" here MUST match spring.application.name in product-service's
// own application.properties -- Feign resolves this name through Eureka automatically
@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/products/{id}/summary")
    ProductSummaryDto getProductSummary(@PathVariable("id") Integer productId);
}