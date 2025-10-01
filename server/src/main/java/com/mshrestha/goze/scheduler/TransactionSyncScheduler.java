package com.mshrestha.goze.scheduler;

import com.mshrestha.goze.dto.plaid.api.TransactionSyncResponse;
import com.mshrestha.goze.model.Account;
import com.mshrestha.goze.model.PlaidItem;
import com.mshrestha.goze.repository.PlaidItemRepository;
import com.mshrestha.goze.service.AccountService;
import com.mshrestha.goze.service.PlaidService;
import com.mshrestha.goze.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Scheduler for daily transaction synchronization with Plaid.
 * Runs once daily at midnight to sync transactions for all active Plaid items.
 */
@Component
public class TransactionSyncScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(TransactionSyncScheduler.class);
    
    @Autowired
    private PlaidService plaidService;
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private PlaidItemRepository plaidItemRepository;
    
    /**
     * Scheduled task to sync transactions once daily at midnight.
     * Runs at 00:00:00 every day.
     */
    @Scheduled(cron = "0 * * * * ?") // Run at midnight every day 0 0 0 * * * // every minute example: 0 * * * * ?
    public void syncAllTransactions() {
        logger.info("Starting scheduled transaction sync at: {}", LocalDateTime.now());
        
        try {
            // Get all active Plaid items
            List<PlaidItem> activeItems = plaidItemRepository.findByActiveTrue();
            logger.info("Found {} active Plaid items to sync", activeItems.size());
            
            int successCount = 0;
            int errorCount = 0;
            
            for (PlaidItem item : activeItems) {
                try {
                    syncTransactionsForItem(item);
                    successCount++;
                } catch (Exception e) {
                    logger.error("Failed to sync transactions for item: {} (user: {})", 
                               item.getItemId(), item.getUserId(), e);
                    errorCount++;
                }
            }

            logger.info("Transaction sync completed. Success: {}, Errors: {}", successCount, errorCount);
            
        } catch (Exception e) {
            logger.error("Failed to execute scheduled transaction sync", e);
        }
    }
    
    /**
     * Sync transactions for a specific Plaid item
     */
    private void syncTransactionsForItem(PlaidItem item) {
        try {
            logger.debug("Syncing transactions for item: {} (user: {})", item.getItemId(), item.getUserId());
            
            // Get the cursor for this item (stored in the database or null for first sync)
            String cursor = item.getCursor();
            
            // Sync transactions from Plaid
            TransactionSyncResponse syncResponse = plaidService.syncTransactions(item.getAccessToken(), cursor);
            
            // Process the sync response and update database
            if (hasTransactionsToProcess(syncResponse)) {
                // Get accounts for this Plaid item
                List<Account> accounts = accountService.getAccountsForPlaidItem(item.getId());
                
                if (!accounts.isEmpty()) {
                    // Process transactions for each account
                    for (Account account : accounts) {
                        transactionService.processTransactionSync(item.getUserId(), account.getId(), syncResponse);
                    }
                } else {
                    logger.warn("No accounts found for Plaid item: {}, skipping transaction sync", item.getItemId());
                }
                
                // Update the cursor for next sync
                updateCursorForItem(item, syncResponse.getNextCursor());
                
                logger.info("Successfully synced transactions for item: {} (user: {})", 
                           item.getItemId(), item.getUserId());
            } else {
                logger.debug("No new transactions to sync for item: {} (user: {})", 
                           item.getItemId(), item.getUserId());
            }
            
        } catch (Exception e) {
            logger.error("Error syncing transactions for item: {} (user: {})", 
                       item.getItemId(), item.getUserId(), e);
            throw e;
        }
    }
    
    /**
     * Check if there are transactions to process in the sync response
     */
    private boolean hasTransactionsToProcess(TransactionSyncResponse syncResponse) {
        return (syncResponse.getAdded() != null && !syncResponse.getAdded().isEmpty()) ||
               (syncResponse.getModified() != null && !syncResponse.getModified().isEmpty()) ||
               (syncResponse.getRemoved() != null && !syncResponse.getRemoved().isEmpty());
    }
    
    /**
     * Get the cursor for the next sync for a Plaid item
     * In a real implementation, this would be stored in the database
     */
    private String getCursorForItem(PlaidItem item) {
        // For now, return null to start from the beginning
        // In production, you'd store and retrieve the cursor from the database
        return null;
    }
    
    /**
     * Update the cursor for the next sync for a Plaid item
     * In a real implementation, this would be stored in the database
     */
    private void updateCursorForItem(PlaidItem item, String nextCursor) {
        // For now, we don't store the cursor
        // In production, you'd save the cursor to the database for the next sync
        if (nextCursor != null) {
            logger.debug("Updated cursor for item: {} to: {}", item.getItemId(), nextCursor);
        }
    }
    
    /**
     * Manual sync method that can be called programmatically
     */
    public void syncTransactionsForUser(UUID userId) {
        logger.info("Manual transaction sync requested for user: {}", userId);
        
        try {
            List<PlaidItem> userItems = plaidItemRepository.findByUserIdAndActiveTrue(userId);
            logger.info("Found {} active Plaid items for user: {}", userItems.size(), userId);
            
            for (PlaidItem item : userItems) {
                try {
                    syncTransactionsForItem(item);
                } catch (Exception e) {
                    logger.error("Failed to sync transactions for item: {} (user: {})", 
                               item.getItemId(), item.getUserId(), e);
                }
            }
            
            logger.info("Manual transaction sync completed for user: {}", userId);
            
        } catch (Exception e) {
            logger.error("Failed to execute manual transaction sync for user: {}", userId, e);
            throw new RuntimeException("Failed to sync transactions for user: " + userId, e);
        }
    }
    
    /**
     * Manual sync method for a specific Plaid item
     */
    public void syncTransactionsForItem(UUID itemId) {
        logger.info("Manual transaction sync requested for item: {}", itemId);
        
        try {
            PlaidItem item = plaidItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Plaid item not found: " + itemId));
            
            if (!item.isActive()) {
                throw new RuntimeException("Plaid item is not active: " + itemId);
            }
            
            syncTransactionsForItem(item);
            logger.info("Manual transaction sync completed for item: {}", itemId);
            
        } catch (Exception e) {
            logger.error("Failed to execute manual transaction sync for item: {}", itemId, e);
            throw new RuntimeException("Failed to sync transactions for item: " + itemId, e);
        }
    }
}