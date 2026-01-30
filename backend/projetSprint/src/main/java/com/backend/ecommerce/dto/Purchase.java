package com.backend.ecommerce.dto;

import lombok.Data;

import java.util.Set;

import com.backend.ecommerce.entity.Address;
import com.backend.ecommerce.entity.Customer;
import com.backend.ecommerce.entity.Order;
import com.backend.ecommerce.entity.OrderItem;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
