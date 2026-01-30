package com.backend.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.backend.ecommerce.entity.Product;
import com.backend.ecommerce.entity.ProductCategory;

//collectionResourceRel Name of entry Json path /product-category
//@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel ="productCategory",path="product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Long> {
}
