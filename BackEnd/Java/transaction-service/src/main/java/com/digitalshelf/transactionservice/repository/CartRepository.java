package com.digitalshelf.transactionservice.repository;

import com.digitalshelf.transactionservice.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByUserId(Integer userId);
    Optional<Cart> findByUserIdAndProductId(Integer userId, Integer productId);
    Optional<Cart> findByCartIdAndUserId(Integer cartId, Integer userId);
}