package com.backend.ecommerce.dto;

import java.math.BigDecimal;

public class AdminProductRequest {

  private Long id;
  private String name;
  private String description;
  private String imageUrl;
  private String sku;
  private BigDecimal unitPrice;
  private Integer unitsInStock;
  private Boolean active;
  private Integer discountPercent;
  private Long categoryId;

  // getters/setters...

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getSku() {
    return sku;
  }

  public void setSku(String sku) {
    this.sku = sku;
  }

  public Integer getUnitsInStock() {
    return unitsInStock;
  }

  public void setUnitsInStock(Integer unitsInStock) {
    this.unitsInStock = unitsInStock;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }

  public Integer getDiscountPercent() {
    return discountPercent;
  }

  public void setDiscountPercent(Integer discountPercent) {
    this.discountPercent = discountPercent;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }
}
