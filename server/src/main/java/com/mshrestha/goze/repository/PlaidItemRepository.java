package com.mshrestha.goze.repository;

import com.mshrestha.goze.model.PlaidItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlaidItemRepository extends JpaRepository<PlaidItem, UUID> {
    
    /**
     * Find all Plaid items for a specific user
     */
    List<PlaidItem> findByUserId(UUID userId);
    
    /**
     * Find a Plaid item by user ID and Plaid item ID
     */
    Optional<PlaidItem> findByUserIdAndItemId(UUID userId, String itemId);
    
    /**
     * Find a Plaid item by access token
     */
    Optional<PlaidItem> findByAccessToken(String accessToken);
    
    /**
     * Check if a Plaid item exists for a user with the given item ID
     */
    boolean existsByUserIdAndItemId(UUID userId, String itemId);
    
    /**
     * Find all active Plaid items for a specific user
     */
    List<PlaidItem> findByUserIdAndActiveTrue(UUID userId);
    
    /**
     * Find Plaid item by institution ID for a specific user
     */
    Optional<PlaidItem> findByUserIdAndInstitutionId(UUID userId, String institutionId);
    
    /**
     * Find all active Plaid items
     */
    List<PlaidItem> findByActiveTrue();
}