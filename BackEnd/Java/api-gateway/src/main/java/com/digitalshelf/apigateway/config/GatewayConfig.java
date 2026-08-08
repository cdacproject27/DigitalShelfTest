package com.digitalshelf.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> authServiceRoute() {
        return route("auth-service")
                .route(path("/api/users/**").or(path("/api/users")), http())
                .filter(lb("auth-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> productServiceRoute() {
        return route("product-service")
                .route(path("/api/products/**").or(path("/api/products")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> authorRoute() {
        return route("author-route")
                .route(path("/api/authors/**").or(path("/api/authors")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> genreRoute() {
        return route("genre-route")
                .route(path("/api/genres/**").or(path("/api/genres")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> languageRoute() {
        return route("language-route")
                .route(path("/api/languages/**").or(path("/api/languages")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> publisherRoute() {
        return route("publisher-route")
                .route(path("/api/publishers/**").or(path("/api/publishers")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> productTypeRoute() {
        return route("product-type-route")
                .route(path("/api/product-types/**").or(path("/api/product-types")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> cartRoute() {
        return route("cart-route")
                .route(path("/api/cart/**").or(path("/api/cart")), http())
                .filter(lb("transaction-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> transactionRoute() {
        return route("transaction-route")
                .route(path("/api/transactions/**").or(path("/api/transactions")), http())
                .filter(lb("transaction-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> myShelfRoute() {
        return route("my-shelf-route")
                .route(path("/api/my-shelf/**").or(path("/api/my-shelf")), http())
                .filter(lb("transaction-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> pdfRawRoute() {
        return route("pdf-raw-route")
                .route(path("/api/products/{productId}/pdf/raw"), http())
                .filter(lb("product-service"))
                .build();
    }
}