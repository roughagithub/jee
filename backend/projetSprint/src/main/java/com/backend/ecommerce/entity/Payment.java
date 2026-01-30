package com.backend.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", length = 3)
    private String currency = "MRO";

    @Column(name = "status", length = 20)
    private String status; // PENDING, COMPLETED, FAILED, CANCELLED

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "BANKILY";

    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;

    @Column(name = "bankily_reference", length = 100)
    private String bankilyReference;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
        if (transactionId == null) {
            transactionId = generateTransactionId();
        }
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}
