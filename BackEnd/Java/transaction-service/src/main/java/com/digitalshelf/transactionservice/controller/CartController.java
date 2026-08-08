package com.digitalshelf.transactionservice.controller;

import com.digitalshelf.transactionservice.dto.CartAddDto;
import com.digitalshelf.transactionservice.dto.CartItemDto;
import com.digitalshelf.transactionservice.dto.CartUpdateDto;
import com.digitalshelf.transactionservice.security.CurrentUserUtil;
import com.digitalshelf.transactionservice.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CurrentUserUtil currentUserUtil;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart() {
        return ResponseEntity.ok(cartService.getCart(currentUserUtil.getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Integer>> addToCart(@RequestBody CartAddDto dto) {
        Integer cartId = cartService.addToCart(currentUserUtil.getCurrentUserId(), dto);
        return ResponseEntity.ok(Map.of("cartId", cartId));
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<String> updateQuantity(@PathVariable Integer cartId, @RequestBody CartUpdateDto dto) {
        cartService.updateQuantity(currentUserUtil.getCurrentUserId(), cartId, dto);
        return ResponseEntity.ok("Cart item updated");
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeItem(@PathVariable Integer cartId) {
        cartService.removeItem(currentUserUtil.getCurrentUserId(), cartId);
        return ResponseEntity.ok("Cart item removed");
    }

    @DeleteMapping
    public ResponseEntity<String> clearCart() {
        cartService.clearCart(currentUserUtil.getCurrentUserId());
        return ResponseEntity.ok("Cart cleared");
    }
}