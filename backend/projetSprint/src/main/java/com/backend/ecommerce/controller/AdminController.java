package com.backend.ecommerce.controller;
import com.backend.ecommerce.dao.ProductRepository;
import com.backend.ecommerce.entity.Product;
import com.backend.ecommerce.dto.AdminProductRequest;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.ecommerce.dao.UserRepository;
import com.backend.ecommerce.entity.User;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            user.setPassword(null); // Masquer le mot de passe
        });
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null); // Masquer le mot de passe
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard() {
        long totalUsers = userRepository.count();

        return ResponseEntity.ok(new AdminDashboardResponse(
            totalUsers,
            "Admin Dashboard",
            "Welcome to Admin Panel"
        ));
    }

    // DTO pour la réponse du dashboard
    public static class AdminDashboardResponse {
        private long totalUsers;
        private String title;
        private String message;

        public AdminDashboardResponse(long totalUsers, String title, String message) {
            this.totalUsers = totalUsers;
            this.title = title;
            this.message = message;
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }






      public static class AdminProductRequest {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private String sku;
        private BigDecimal unitPrice;   // <<< BigDecimal, pas Double
        private Integer unitsInStock;
        private Boolean active;
        private Integer discountPercent; // nullable
        private Long categoryId;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public Integer getUnitsInStock() { return unitsInStock; }
        public void setUnitsInStock(Integer unitsInStock) { this.unitsInStock = unitsInStock; }

        public Boolean getActive() { return active; }
        public void setActive(Boolean active) { this.active = active; }

        public Integer getDiscountPercent() { return discountPercent; }
        public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
      }


  // Liste de tous les produits (pour l'admin)
  @GetMapping("/products")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<Product>> getAllProductsAdmin() {
    List<Product> products = productRepository.findAll();
    return ResponseEntity.ok(products);
  }

  // Créer un nouveau produit
  @PostMapping("/products")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Product> createProduct(@RequestBody AdminProductRequest req) {
    Product p = new Product();
    p.setName(req.getName());
    p.setDescription(req.getDescription());
    p.setImageUrl(req.getImageUrl());
    p.setSku(req.getSku());
    p.setUnitPrice(req.getUnitPrice());
    p.setUnitsInStock(req.getUnitsInStock() != null ? req.getUnitsInStock() : 0);
    p.setActive(req.getActive() != null ? req.getActive() : true);
    p.setDiscountPercent(req.getDiscountPercent()); // besoin du champ dans l'entité Product

    // TODO: si tu gères les catégories, retrouver la catégorie par id et la setter ici

    Product saved = productRepository.save(p);
    return ResponseEntity.ok(saved);
  }

  // Mettre à jour un produit (prix, stock, sold out, discount, etc.)
  @PutMapping("/products/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                               @RequestBody AdminProductRequest req) {
    Product p = productRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Product not found"));

    if (req.getName() != null) p.setName(req.getName());
    if (req.getDescription() != null) p.setDescription(req.getDescription());
    if (req.getImageUrl() != null) p.setImageUrl(req.getImageUrl());
    if (req.getSku() != null) p.setSku(req.getSku());
    if (req.getUnitPrice() != null) p.setUnitPrice(req.getUnitPrice());
    if (req.getUnitsInStock() != null) p.setUnitsInStock(req.getUnitsInStock()!= null ? req.getUnitsInStock() : 0);
    if (req.getActive() != null) p.setActive(req.getActive() != null ? req.getActive() : true);


    Product saved = productRepository.save(p);
    return ResponseEntity.ok(saved);
  }

  // Supprimer un produit
  @DeleteMapping("/products/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
    productRepository.deleteById(id);
    return ResponseEntity.ok("Product deleted successfully!");
  }
}
