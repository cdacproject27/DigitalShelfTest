package com.digitalshelf.transactionservice.repository;

import com.digitalshelf.transactionservice.entity.MyShelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyShelfRepository extends JpaRepository<MyShelf, Integer> {
    List<MyShelf> findByUserId(Integer userId);
    Optional<MyShelf> findByUserIdAndProductId(Integer userId, Integer productId);
}