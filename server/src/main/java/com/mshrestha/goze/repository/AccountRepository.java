package com.mshrestha.goze.repository;

import com.mshrestha.goze.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    
    /**
     * Find all accounts for a specific user
     */
    List<Account> findByUserId(UUID userId);
    
    /**
     * Find all active accounts for a specific user
     */
    List<Account> findByUserIdAndActiveTrue(UUID userId);
    
    /**
     * Find account by user ID and Plaid account ID
     */
    Optional<Account> findByUserIdAndAccountId(UUID userId, String accountId);
    
    /**
     * Find all accounts for a specific Plaid item
     */
    List<Account> findByPlaidItemId(UUID plaidItemId);
    
    /**
     * Find all active accounts for a specific Plaid item
     */
    List<Account> findByPlaidItemIdAndActiveTrue(UUID plaidItemId);
    
    /**
     * Check if account exists for user with given account ID
     */
    boolean existsByUserIdAndAccountId(UUID userId, String accountId);
    
    /**
     * Find accounts by type (e.g., "depository", "credit", "loan")
     */
    List<Account> findByUserIdAndType(UUID userId, String type);
    
    /**
     * Find accounts for a user ordered by last update
     */
    List<Account> findByUserIdOrderByLastUpdatedDesc(UUID userId);
    
    /**
     * Find accounts by subtype (e.g., "checking", "savings", "credit card")
     */
    List<Account> findByUserIdAndSubtype(UUID userId, String subtype);
}