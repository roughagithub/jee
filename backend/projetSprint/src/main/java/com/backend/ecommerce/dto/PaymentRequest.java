package com.backend.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequest {
    
    private BigDecimal amount;
    private String phoneNumber;
    private String description;
    private String currency = "MRO";
    
    // Validation
    public boolean isValid() {
        return amount != null && 
               amount.compareTo(BigDecimal.ZERO) > 0 && 
               phoneNumber != null && 
               !phoneNumber.trim().isEmpty();
    }
}
