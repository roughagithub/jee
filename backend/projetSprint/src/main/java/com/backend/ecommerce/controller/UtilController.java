package com.backend.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/util")
public class UtilController {

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/hash/{password}")
    public Map<String, String> hashPassword(@PathVariable String password) {
        Map<String, String> response = new HashMap<>();
        String hashedPassword = encoder.encode(password);
        response.put("password", password);
        response.put("hashed", hashedPassword);
        return response;
    }

    @GetMapping("/test-users")
    public Map<String, Object> getTestUsers() {
        Map<String, Object> response = new HashMap<>();
        
        // Générer les hash pour les mots de passe de test
        Map<String, String> users = new HashMap<>();
        users.put("admin", encoder.encode("admin123"));
        users.put("client", encoder.encode("client123"));
        users.put("superadmin", encoder.encode("super123"));
        
        response.put("users", users);
        response.put("message", "Utilisez ces hash dans data.sql");
        
        return response;
    }
}
