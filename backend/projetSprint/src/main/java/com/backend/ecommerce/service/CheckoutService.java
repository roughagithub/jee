package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.Purchase;
import com.backend.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
