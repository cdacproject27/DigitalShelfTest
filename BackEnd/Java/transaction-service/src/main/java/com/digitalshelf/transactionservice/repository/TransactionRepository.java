package com.digitalshelf.transactionservice.repository;

import com.digitalshelf.transactionservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByCreatedAtDesc(Integer userId);
    Optional<Transaction> findByTransactionIdAndUserId(Long transactionId, Integer userId);
}