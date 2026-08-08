package com.digitalshelf.transactionservice.service;

import com.digitalshelf.transactionservice.client.ProductClient;
import com.digitalshelf.transactionservice.dto.CartAddDto;
import com.digitalshelf.transactionservice.dto.CartItemDto;
import com.digitalshelf.transactionservice.dto.CartUpdateDto;
import com.digitalshelf.transactionservice.dto.ProductSummaryDto;
import com.digitalshelf.transactionservice.entity.Cart;
import com.digitalshelf.transactionservice.exception.BadRequestException;
import com.digitalshelf.transactionservice.exception.NotFoundException;
import com.digitalshelf.transactionservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public List<CartItemDto> getCart(Integer userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(cart -> {
                    ProductSummaryDto product = productClient.getProductSummary(cart.getProductId());
                    BigDecimal unitPrice = product.getProductOfferprice() != null
                            ? product.getProductOfferprice() : product.getProductBaseprice();

                    return CartItemDto.builder()
                            .cartId(cart.getCartId())
                            .productId(cart.getProductId())
                            .productName(product.getProductName())
                            .productImage(product.getProductImage())
                            .productBaseprice(product.getProductBaseprice())
                            .productOfferprice(product.getProductOfferprice())
                            .qty(cart.getQty())
                            .lineTotal(unitPrice.multiply(BigDecimal.valueOf(cart.getQty())))
                            .isRentable(product.isRentable())
                            .build();
                })
                .toList();
    }

    public Integer addToCart(Integer userId, CartAddDto dto) {
        // Confirms the product genuinely exists (Feign call throws if product-service 404s)
        productClient.getProductSummary(dto.getProductId());

        if (dto.getQty() < 1) {
            throw new BadRequestException("Quantity must be at least 1.");
        }

        var existing = cartRepository.findByUserIdAndProductId(userId, dto.getProductId());

        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setQty(cart.getQty() + dto.getQty());
            cartRepository.save(cart);
            return cart.getCartId();
        }

        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setProductId(dto.getProductId());
        cart.setQty(dto.getQty());
        cartRepository.save(cart);
        return cart.getCartId();
    }

    public void updateQuantity(Integer userId, Integer cartId, CartUpdateDto dto) {
        if (dto.getQty() < 1) {
            throw new BadRequestException("Quantity must be at least 1.");
        }

        Cart cart = cartRepository.findByCartIdAndUserId(cartId, userId)
                .orElseThrow(() -> new NotFoundException("Cart item not found."));

        cart.setQty(dto.getQty());
        cartRepository.save(cart);
    }

    public void removeItem(Integer userId, Integer cartId) {
        Cart cart = cartRepository.findByCartIdAndUserId(cartId, userId)
                .orElseThrow(() -> new NotFoundException("Cart item not found."));
        cartRepository.delete(cart);
    }

    public void clearCart(Integer userId) {
        cartRepository.deleteAll(cartRepository.findByUserId(userId));
    }
}