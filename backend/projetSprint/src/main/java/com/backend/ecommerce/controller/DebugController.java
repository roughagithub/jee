package com.backend.ecommerce.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/auth-info")
    public Map<String, Object> getAuthInfo() {
        Map<String, Object> response = new HashMap<>();
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null) {
            response.put("authenticated", auth.isAuthenticated());
            response.put("principal", auth.getPrincipal());
            response.put("authorities", auth.getAuthorities());
            response.put("name", auth.getName());
        } else {
            response.put("authenticated", false);
            response.put("message", "No authentication found");
        }
        
        return response;
    }

    @GetMapping("/headers")
    public Map<String, String> getHeaders(@RequestHeader Map<String, String> headers) {
        Map<String, String> response = new HashMap<>();
        
        // Filtrer les headers pertinents
        headers.forEach((key, value) -> {
            if (key.toLowerCase().contains("auth") || 
                key.toLowerCase().contains("token") ||
                key.toLowerCase().contains("authorization")) {
                response.put(key, value);
            }
        });
        
        return response;
    }
}
