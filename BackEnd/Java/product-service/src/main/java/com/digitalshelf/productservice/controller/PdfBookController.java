package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.service.PdfBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/pdf")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PdfBookController {

    private final PdfBookService pdfBookService;

    @PostMapping
    public ResponseEntity<String> uploadPdf(@PathVariable Integer productId,
                                             @RequestParam("file") MultipartFile file) {
        pdfBookService.uploadPdf(productId, file);
        return ResponseEntity.ok("PDF uploaded successfully");
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> hasPdf(@PathVariable Integer productId) {
        return ResponseEntity.ok(Map.of("hasPdf", pdfBookService.hasPdf(productId)));
    }

    @DeleteMapping
    public ResponseEntity<String> deletePdf(@PathVariable Integer productId) {
        pdfBookService.deletePdf(productId);
        return ResponseEntity.ok("PDF removed successfully");
    }
}