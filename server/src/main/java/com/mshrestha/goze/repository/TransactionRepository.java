package com.mshrestha.goze.repository;

import com.mshrestha.goze.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    /**
     * Find transaction by user ID and Plaid transaction ID
     */
    Optional<Transaction> findByUserIdAndPlaidTransactionId(UUID userId, String plaidTransactionId);
    
    /**
     * Find all transactions for a user
     */
    List<Transaction> findByUserIdOrderByDateDesc(UUID userId);
    
    /**
     * Find transactions for a user within a date range
     */
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.date BETWEEN :startDate AND :endDate ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") UUID userId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    /**
     * Find transactions for a specific account
     */
    List<Transaction> findByAccountIdOrderByDateDesc(UUID accountId);
    
    /**
     * Find pending transactions for a user
     */
    List<Transaction> findByUserIdAndPendingTrueOrderByDateDesc(UUID userId);
    
    
    /**
     * Find transactions by merchant name (case insensitive)
     */
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND LOWER(t.merchantName) LIKE LOWER(CONCAT('%', :merchantName, '%')) ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndMerchantNameContainingIgnoreCase(@Param("userId") UUID userId, 
                                                                     @Param("merchantName") String merchantName);
    
    /**
     * Count transactions for a user
     */
    long countByUserId(UUID userId);
    
    /**
     * Find the latest transaction date for a user
     */
    @Query("SELECT MAX(t.date) FROM Transaction t WHERE t.userId = :userId")
    Optional<LocalDate> findLatestTransactionDateByUserId(@Param("userId") UUID userId);
    
    /**
     * Find transactions that need to be synced (no Plaid transaction ID)
     */
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.plaidTransactionId IS NULL ORDER BY t.date DESC")
    List<Transaction> findUnsyncedTransactionsByUserId(@Param("userId") UUID userId);
    
    /**
     * Delete transactions by Plaid transaction IDs
     */
    void deleteByUserIdAndPlaidTransactionIdIn(UUID userId, List<String> plaidTransactionIds);
}