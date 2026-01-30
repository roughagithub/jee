package com.backend.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Customer findByEmail(String theEmail);
}
