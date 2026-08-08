package com.digitalshelf.transactionservice.service;

import com.digitalshelf.transactionservice.client.ProductClient;
import com.digitalshelf.transactionservice.dto.*;
import com.digitalshelf.transactionservice.entity.Cart;
import com.digitalshelf.transactionservice.entity.MyShelf;
import com.digitalshelf.transactionservice.entity.Transaction;
import com.digitalshelf.transactionservice.entity.TransactionItem;
import com.digitalshelf.transactionservice.exception.BadRequestException;
import com.digitalshelf.transactionservice.exception.NotFoundException;
import com.digitalshelf.transactionservice.repository.CartRepository;
import com.digitalshelf.transactionservice.repository.MyShelfRepository;
import com.digitalshelf.transactionservice.repository.TransactionItemRepository;
import com.digitalshelf.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import feign.FeignException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final String COMPLETED_STATUS = "COMPLETED";

    private final CartRepository cartRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final MyShelfRepository myShelfRepository;
    private final ProductClient productClient;

    @Transactional
    public TransactionDetailDto checkout(Integer userId, CheckoutDto dto) {
        String transactionType = dto.getTransactionType() != null ? dto.getTransactionType().trim().toUpperCase() : "";

        if (!transactionType.equals("BUY") && !transactionType.equals("RENT")) {
            throw new BadRequestException("TransactionType must be either 'BUY' or 'RENT'.");
        }

        if (transactionType.equals("RENT") && (dto.getRentDays() == null || dto.getRentDays() <= 0)) {
            throw new BadRequestException("RentDays is required and must be greater than 0 when renting.");
        }

        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty.");
        }
     List<ProductSummaryDto> products = new ArrayList<>();
     for (Cart item : cartItems) {
         ProductSummaryDto product;
         try {
             product = productClient.getProductSummary(item.getProductId());
         } catch (FeignException.NotFound e) {
             // Genuinely doesn't exist -- stale cart row, product was deleted
             throw new NotFoundException(
                     "Product " + item.getProductId() + " no longer exists. Please remove it from your cart.");
         } catch (FeignException e) {
             // product-service reachable but returned an error, or is down/unreachable
             throw new BadRequestException(
                     "Could not reach the product catalog right now. Please try again in a moment.");
         }
         products.add(product);

         if (transactionType.equals("RENT") && !product.isRentable()) {
             throw new BadRequestException("This item is not rentable: " + product.getProductName());
         }
     }
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<TransactionItem> transactionItems = new ArrayList<>();
        for (int i = 0; i < cartItems.size(); i++) {
            Cart cartItem = cartItems.get(i);
            ProductSummaryDto product = products.get(i);

            BigDecimal unitPrice;
            if (transactionType.equals("RENT")) {
                if (product.getRentPerDay() == null) {
                    throw new BadRequestException("Rent price not set for: " + product.getProductName());
                }
                unitPrice = product.getRentPerDay().multiply(BigDecimal.valueOf(dto.getRentDays()));
            } else {
                unitPrice = product.getProductOfferprice() != null
                        ? product.getProductOfferprice()
                        : product.getProductBaseprice();
                if (unitPrice == null) {
                    throw new BadRequestException("No price set for: " + product.getProductName());
                }
            }

            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQty())));

            TransactionItem item = new TransactionItem();
            item.setProductId(cartItem.getProductId());
            item.setPrice(unitPrice);
            item.setQuantity(cartItem.getQty());
            transactionItems.add(item);
        }

        Transaction transaction = new Transaction();
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setStatus(COMPLETED_STATUS);
        transaction.setTotalAmount(totalAmount);
        transaction.setTransactionType(transactionType);
        transaction.setUserId(userId);
        transactionRepository.save(transaction);

        for (TransactionItem item : transactionItems) {
            item.setTransactionId(transaction.getTransactionId());
        }
        transactionItemRepository.saveAll(transactionItems);

        // Add or extend My Shelf entries
        for (Cart cartItem : cartItems) {
            var shelfEntryOpt = myShelfRepository.findByUserIdAndProductId(userId, cartItem.getProductId());

            LocalDateTime expiryDate = transactionType.equals("RENT")
                    ? LocalDateTime.now().plusDays(dto.getRentDays())
                    : null;

            if (shelfEntryOpt.isEmpty()) {
                MyShelf shelfEntry = new MyShelf();
                shelfEntry.setUserId(userId);
                shelfEntry.setProductId(cartItem.getProductId());
                shelfEntry.setProductExpiryDate(expiryDate);
                myShelfRepository.save(shelfEntry);
            } else {
                MyShelf shelfEntry = shelfEntryOpt.get();
                if (transactionType.equals("RENT")) {
                    LocalDateTime baseDate = (shelfEntry.getProductExpiryDate() != null
                            && shelfEntry.getProductExpiryDate().isAfter(LocalDateTime.now()))
                            ? shelfEntry.getProductExpiryDate() : LocalDateTime.now();
                    shelfEntry.setProductExpiryDate(baseDate.plusDays(dto.getRentDays()));
                } else {
                    shelfEntry.setProductExpiryDate(null); // upgraded to owned permanently
                }
                myShelfRepository.save(shelfEntry);
            }
        }

        cartRepository.deleteAll(cartItems);

        return getTransactionById(userId, transaction.getTransactionId());
    }

    public List<TransactionSummaryDto> getMyTransactions(Integer userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(t -> TransactionSummaryDto.builder()
                        .transactionId(t.getTransactionId())
                        .createdAt(t.getCreatedAt())
                        .status(t.getStatus())
                        .totalAmount(t.getTotalAmount())
                        .transactionType(t.getTransactionType())
                        .build())
                .toList();
    }

    public TransactionDetailDto getTransactionById(Integer userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByTransactionIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new NotFoundException("Transaction not found."));

        List<TransactionItemDto> items = transactionItemRepository.findByTransactionId(transactionId).stream()
                .map(ti -> {
                    String productName;
                    try {
                        productName = productClient.getProductSummary(ti.getProductId()).getProductName();
                    } catch (Exception e) {
                        productName = null; // product may have been deleted since the transaction happened
                    }

                    return TransactionItemDto.builder()
                            .itemId(ti.getItemId())
                            .productId(ti.getProductId())
                            .productName(productName)
                            .price(ti.getPrice())
                            .quantity(ti.getQuantity())
                            .build();
                })
                .toList();

        TransactionDetailDto detail = new TransactionDetailDto();
        detail.setTransactionId(transaction.getTransactionId());
        detail.setCreatedAt(transaction.getCreatedAt());
        detail.setStatus(transaction.getStatus());
        detail.setTotalAmount(transaction.getTotalAmount());
        detail.setTransactionType(transaction.getTransactionType());
        detail.setItems(items);

        return detail;
    }
}