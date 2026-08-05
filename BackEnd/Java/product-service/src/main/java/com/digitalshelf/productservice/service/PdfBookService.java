package com.digitalshelf.productservice.service;

import com.digitalshelf.productservice.entity.PdfBook;
import com.digitalshelf.productservice.exception.BadRequestException;
import com.digitalshelf.productservice.exception.NotFoundException;
import com.digitalshelf.productservice.repository.PdfBookRepository;
import com.digitalshelf.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PdfBookService {

    private final PdfBookRepository pdfBookRepository;
    private final ProductRepository productRepository;

    private static final long MAX_FILE_SIZE_BYTES = 50L * 1024 * 1024;

    public void uploadPdf(Integer productId, MultipartFile file) {
        if (!productRepository.existsById(productId)) {
            throw new NotFoundException("Product with id " + productId + " was not found.");
        }

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File is too large. Maximum size is 50 MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are allowed.");
        }

        try {
            byte[] fileBytes = file.getBytes();

            PdfBook pdfBook = pdfBookRepository.findByProductId(productId).orElse(new PdfBook());
            pdfBook.setProductId(productId);
            pdfBook.setFileName(originalFilename);
            pdfBook.setPdfData(fileBytes);

            pdfBookRepository.save(pdfBook);
        } catch (IOException e) {
            throw new BadRequestException("Could not read the uploaded file.");
        }
    }

    public boolean hasPdf(Integer productId) {
        return pdfBookRepository.existsByProductId(productId);
    }

    public void deletePdf(Integer productId) {
        PdfBook pdfBook = pdfBookRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("No PDF found for this product."));
        pdfBookRepository.delete(pdfBook);
    }
}