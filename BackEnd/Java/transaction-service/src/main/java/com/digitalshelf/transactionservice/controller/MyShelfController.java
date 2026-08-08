package com.digitalshelf.transactionservice.controller;

import com.digitalshelf.transactionservice.dto.MyShelfItemDto;
import com.digitalshelf.transactionservice.security.CurrentUserUtil;
import com.digitalshelf.transactionservice.service.MyShelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my-shelf")
@RequiredArgsConstructor
public class MyShelfController {

    private final MyShelfService myShelfService;
    private final CurrentUserUtil currentUserUtil;

    @GetMapping
    public ResponseEntity<List<MyShelfItemDto>> getMyShelf() {
        return ResponseEntity.ok(myShelfService.getMyShelf(currentUserUtil.getCurrentUserId()));
    }

    @GetMapping(value = "/{productId}/read", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> readBook(@PathVariable Integer productId) {
        byte[] pdfBytes = myShelfService.getBookForReading(currentUserUtil.getCurrentUserId(), productId);
        return ResponseEntity.ok(pdfBytes);
    }
}