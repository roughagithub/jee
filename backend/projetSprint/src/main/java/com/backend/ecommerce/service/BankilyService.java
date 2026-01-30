package com.backend.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.ecommerce.dao.PaymentRepository;
import com.backend.ecommerce.entity.Payment;
import com.backend.ecommerce.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class BankilyService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${bankily.api.key:demo_key}")
    private String bankilyApiKey;

    @Value("${bankily.api.url:https://api.bankily.com}")
    private String bankilyApiUrl;

    @Value("${bankily.merchant.code:DEMO_MERCHANT}")
    private String merchantCode;

    /**
     * Crée une intention de paiement Bankily
     */
    @Transactional
    public Map<String, Object> createPaymentIntent(BigDecimal amount, String phoneNumber, String description, Long userId) {
        
        // Créer le paiement en base de données
        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setPhoneNumber(phoneNumber);
        payment.setDescription(description);
        payment.setStatus("PENDING");
        payment.setUser(new User()); // TODO: Récupérer l'utilisateur par ID
        payment.getUser().setId(userId);

        payment = paymentRepository.save(payment);

        // Simuler l'appel API Bankily (en production, utilisez vraie API)
        Map<String, Object> bankilyResponse = simulateBankilyApiCall(payment);

        // Mettre à jour le paiement avec la référence Bankily
        payment.setBankilyReference((String) bankilyResponse.get("reference"));
        paymentRepository.save(payment);

        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("transactionId", payment.getTransactionId());
        response.put("amount", payment.getAmount());
        response.put("currency", payment.getCurrency());
        response.put("status", payment.getStatus());
        response.put("bankilyReference", payment.getBankilyReference());
        response.put("paymentUrl", bankilyResponse.get("paymentUrl"));
        response.put("qrCode", bankilyResponse.get("qrCode"));
        response.put("expiresAt", LocalDateTime.now().plusMinutes(15));

        return response;
    }

    /**
     * Confirme un paiement après callback Bankily
     */
    @Transactional
    public Payment confirmPayment(String bankilyReference, String status) {
        
        Payment payment = paymentRepository.findByBankilyReference(bankilyReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if ("SUCCESS".equals(status)) {
            payment.setStatus("COMPLETED");
            payment.setCompletedAt(LocalDateTime.now());
        } else if ("FAILED".equals(status)) {
            payment.setStatus("FAILED");
        } else if ("CANCELLED".equals(status)) {
            payment.setStatus("CANCELLED");
        }

        return paymentRepository.save(payment);
    }

    /**
     * Vérifie le statut d'un paiement
     */
    public Payment getPaymentStatus(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /**
     * Simulation de l'appel API Bankily (remplacer par vraie intégration)
     */
    private Map<String, Object> simulateBankilyApiCall(Payment payment) {
        Map<String, Object> response = new HashMap<>();
        
        // En production, faire un vrai appel HTTP à l'API Bankily
        // POST /api/v1/payments
        // Headers: Authorization: Bearer <bankily_api_key>
        // Body: { amount, phoneNumber, merchantCode, etc. }
        
        response.put("reference", "BKY" + System.currentTimeMillis());
        response.put("paymentUrl", "https://payment.bankily.com/pay/" + response.get("reference"));
        response.put("qrCode", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
        
        return response;
    }

    /**
     * Vérifie si un numéro de téléphone est valide pour Bankily
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        // Numéros mauritaniens: +222 ou 222 suivi de 7 chiffres
        return phoneNumber != null && 
               (phoneNumber.matches("^\\+222[0-9]{7}$") || 
                phoneNumber.matches("^222[0-9]{7}$"));
    }

    /**
     * Formate le numéro de téléphone pour Bankily
     */
    public String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber.startsWith("+")) {
            return phoneNumber.substring(1);
        }
        return phoneNumber;
    }
}
