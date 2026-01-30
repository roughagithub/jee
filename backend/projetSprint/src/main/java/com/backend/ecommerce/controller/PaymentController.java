package com.backend.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.backend.ecommerce.dto.PaymentRequest;
import com.backend.ecommerce.dto.PaymentResponse;
import com.backend.ecommerce.entity.Payment;
import com.backend.ecommerce.service.BankilyService;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private BankilyService bankilyService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest) {
        
        try {
            // Valider le numéro de téléphone
            if (!bankilyService.isValidPhoneNumber(paymentRequest.getPhoneNumber())) {
                return ResponseEntity.badRequest().body(
                    createErrorResponse("Numéro de téléphone invalide pour Bankily")
                );
            }

            // Obtenir l'utilisateur authentifié
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Créer le paiement
            Map<String, Object> paymentIntent = bankilyService.createPaymentIntent(
                paymentRequest.getAmount(),
                paymentRequest.getPhoneNumber(),
                paymentRequest.getDescription(),
                1L // TODO: Récupérer l'ID utilisateur réel
            );

            return ResponseEntity.ok(paymentIntent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                createErrorResponse("Erreur lors de la création du paiement: " + e.getMessage())
            );
        }
    }

    @GetMapping("/status/{transactionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENT', 'ROLE_ADMIN')")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String transactionId) {
        
        try {
            Payment payment = bankilyService.getPaymentStatus(transactionId);
            
            PaymentResponse response = new PaymentResponse(
                payment.getTransactionId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getBankilyReference(),
                payment.getCreatedAt(),
                payment.getCompletedAt()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                createErrorResponse("Paiement non trouvé: " + e.getMessage())
            );
        }
    }

    @PostMapping("/callback/bankily")
    public ResponseEntity<?> bankilyCallback(@RequestBody Map<String, Object> callbackData) {
        
        try {
            String reference = (String) callbackData.get("reference");
            String status = (String) callbackData.get("status");

            Payment payment = bankilyService.confirmPayment(reference, status);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("transactionId", payment.getTransactionId());
            response.put("paymentStatus", payment.getStatus());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                createErrorResponse("Erreur lors du traitement du callback: " + e.getMessage())
            );
        }
    }

    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods() {
        
        Map<String, Object> methods = new HashMap<>();
        methods.put("bankily", Map.of(
            "name", "Bankily",
            "description", "Paiement mobile par Bankily",
            "currency", "MRO",
            "minAmount", 100,
            "maxAmount", 1000000,
            "phonePattern", "^\\+222[0-9]{7}$"
        ));

        return ResponseEntity.ok(methods);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
