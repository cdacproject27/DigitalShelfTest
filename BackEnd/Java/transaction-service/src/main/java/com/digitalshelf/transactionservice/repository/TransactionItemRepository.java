package com.digitalshelf.transactionservice.repository;

import com.digitalshelf.transactionservice.entity.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionItemRepository extends JpaRepository<TransactionItem, Integer> {
    List<TransactionItem> findByTransactionId(Long transactionId);
}