package com.backend.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResponse {
    
    private String transactionId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String bankilyReference;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    public PaymentResponse(String transactionId, BigDecimal amount, String currency, 
                          String status, String bankilyReference, 
                          LocalDateTime createdAt, LocalDateTime completedAt) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.bankilyReference = bankilyReference;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }
}
