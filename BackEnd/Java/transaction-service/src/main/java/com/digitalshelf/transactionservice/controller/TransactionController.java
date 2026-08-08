package com.digitalshelf.transactionservice.controller;

import com.digitalshelf.transactionservice.dto.CheckoutDto;
import com.digitalshelf.transactionservice.dto.TransactionDetailDto;
import com.digitalshelf.transactionservice.dto.TransactionSummaryDto;
import com.digitalshelf.transactionservice.security.CurrentUserUtil;
import com.digitalshelf.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final CurrentUserUtil currentUserUtil;

    @PostMapping("/checkout")
    public ResponseEntity<TransactionDetailDto> checkout(@RequestBody CheckoutDto dto) {
        return ResponseEntity.ok(transactionService.checkout(currentUserUtil.getCurrentUserId(), dto));
    }

    @GetMapping
    public ResponseEntity<List<TransactionSummaryDto>> getMyTransactions() {
        return ResponseEntity.ok(transactionService.getMyTransactions(currentUserUtil.getCurrentUserId()));
    }

    @GetMapping("{id}")
    public ResponseEntity<TransactionDetailDto> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(currentUserUtil.getCurrentUserId(), id));
    }
}