package com.backend.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<String> publicAccess() {
        return ResponseEntity.ok("Public access - Anyone can see this");
    }

    @GetMapping("/user")
    public ResponseEntity<String> userAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("User access - Hello " + auth.getName() + "!");
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Admin access - Hello " + auth.getName() + "!");
    }
}
