package com.backend.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.ecommerce.entity.User;
import com.backend.ecommerce.security.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/client")
public class ClientController {

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<User> getClientProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Créer un User à partir des UserDetails
        User user = new User();
        user.setId(userDetails.getId());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPassword(null); // Masquer le mot de passe
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getClientDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(new ClientDashboardResponse(
            userDetails.getUsername(),
            userDetails.getEmail(),
            "Client Dashboard",
            "Welcome to your personal space"
        ));
    }

    @PostMapping("/update-profile")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Mettre à jour les informations (exemple)
        // TODO: Implémenter la logique de mise à jour en base de données
        
        return ResponseEntity.ok("Profile updated successfully!");
    }

    // DTO pour la réponse du dashboard client
    public static class ClientDashboardResponse {
        private String username;
        private String email;
        private String title;
        private String message;

        public ClientDashboardResponse(String username, String email, String title, String message) {
            this.username = username;
            this.email = email;
            this.title = title;
            this.message = message;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    // DTO pour la mise à jour du profil
    public static class ProfileUpdateRequest {
        private String email;
        private String firstName;
        private String lastName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }
}
