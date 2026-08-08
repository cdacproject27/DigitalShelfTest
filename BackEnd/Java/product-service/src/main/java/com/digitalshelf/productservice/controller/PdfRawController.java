package com.digitalshelf.productservice.controller;

import com.digitalshelf.productservice.entity.PdfBook;
import com.digitalshelf.productservice.service.PdfBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class PdfRawController {

    private final PdfBookService pdfBookService;

    @GetMapping(value = "/api/products/{productId}/pdf/raw", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getRawPdf(@PathVariable Integer productId) {
        PdfBook pdfBook = pdfBookService.getPdfBook(productId);
        return ResponseEntity.ok(pdfBook.getPdfData());
    }
}