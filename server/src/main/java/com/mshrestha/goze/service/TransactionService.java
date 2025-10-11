package com.mshrestha.goze.service;

import com.mshrestha.goze.dto.plaid.api.TransactionSyncResponse;
import com.mshrestha.goze.model.Transaction;
import com.mshrestha.goze.repository.TransactionRepository;
import com.mshrestha.goze.utils.GsonUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
    
    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private GsonUtility gsonUtility;
    
    /**
     * Process transaction sync response and update database
     */
    @Transactional
    public void processTransactionSync(UUID userId, UUID accountId, TransactionSyncResponse syncResponse) {
        try {
            logger.info("Processing transaction sync for user: {}, account: {}", userId, accountId);
            
            // Process added transactions
            if (syncResponse.getAdded() != null && !syncResponse.getAdded().isEmpty()) {
                processAddedTransactions(userId, accountId, syncResponse.getAdded());
            }
            
            // Process modified transactions
            if (syncResponse.getModified() != null && !syncResponse.getModified().isEmpty()) {
                processModifiedTransactions(userId, accountId, syncResponse.getModified());
            }
            
            // Process removed transactions
            if (syncResponse.getRemoved() != null && !syncResponse.getRemoved().isEmpty()) {
                processRemovedTransactions(userId, syncResponse.getRemoved());
            }
            
            logger.info("Successfully processed transaction sync for user: {}, account: {}", userId, accountId);
            
        } catch (Exception e) {
            logger.error("Failed to process transaction sync for user: {}, account: {}", userId, accountId, e);
            throw new RuntimeException("Failed to process transaction sync: " + e.getMessage(), e);
        }
    }
    
    /**
     * Process added transactions
     */
    private void processAddedTransactions(UUID userId, UUID accountId, List<TransactionSyncResponse.Transaction> addedTransactions) {
        logger.info("Processing {} added transactions for user: {}", addedTransactions.size(), userId);
        
        for (TransactionSyncResponse.Transaction plaidTransaction : addedTransactions) {
            try {
                // Check if transaction already exists
                Optional<Transaction> existingTransaction = transactionRepository
                    .findByUserIdAndPlaidTransactionId(userId, plaidTransaction.getTransactionId());
                
                if (existingTransaction.isPresent()) {
                    logger.debug("Transaction {} already exists, skipping", plaidTransaction.getTransactionId());
                    continue;
                }
                
                // Create new transaction
                Transaction transaction = createTransactionFromPlaid(userId, accountId, plaidTransaction);
                transactionRepository.save(transaction);
                
                logger.debug("Added transaction: {}", plaidTransaction.getTransactionId());
                
            } catch (Exception e) {
                logger.error("Failed to add transaction: {}", plaidTransaction.getTransactionId(), e);
            }
        }
    }
    
    /**
     * Process modified transactions
     */
    private void processModifiedTransactions(UUID userId, UUID accountId, List<TransactionSyncResponse.Transaction> modifiedTransactions) {
        logger.info("Processing {} modified transactions for user: {}", modifiedTransactions.size(), userId);
        
        for (TransactionSyncResponse.Transaction plaidTransaction : modifiedTransactions) {
            try {
                // Find existing transaction
                Optional<Transaction> existingTransaction = transactionRepository
                    .findByUserIdAndPlaidTransactionId(userId, plaidTransaction.getTransactionId());
                
                if (existingTransaction.isPresent()) {
                    // Update existing transaction
                    Transaction transaction = existingTransaction.get();
                    updateTransactionFromPlaid(transaction, plaidTransaction);
                    transactionRepository.save(transaction);
                    
                    logger.debug("Updated transaction: {}", plaidTransaction.getTransactionId());
                } else {
                    // Create new transaction if it doesn't exist
                    Transaction transaction = createTransactionFromPlaid(userId, accountId, plaidTransaction);
                    transactionRepository.save(transaction);
                    
                    logger.debug("Created new transaction from modified: {}", plaidTransaction.getTransactionId());
                }
                
            } catch (Exception e) {
                logger.error("Failed to modify transaction: {}", plaidTransaction.getTransactionId(), e);
            }
        }
    }
    
    /**
     * Process removed transactions
     */
    private void processRemovedTransactions(UUID userId, List<TransactionSyncResponse.RemovedTransaction> removedTransactions) {
        logger.info("Processing {} removed transactions for user: {}", removedTransactions.size(), userId);
        
        List<String> plaidTransactionIds = new ArrayList<>();
        for (TransactionSyncResponse.RemovedTransaction removedTransaction : removedTransactions) {
            plaidTransactionIds.add(removedTransaction.getTransactionId());
        }
        
        if (!plaidTransactionIds.isEmpty()) {
            transactionRepository.deleteByUserIdAndPlaidTransactionIdIn(userId, plaidTransactionIds);
            logger.info("Removed {} transactions for user: {}", plaidTransactionIds.size(), userId);
        }
    }
    
    /**
     * Create Transaction entity from Plaid transaction
     */
    private Transaction createTransactionFromPlaid(UUID userId, UUID accountId, TransactionSyncResponse.Transaction plaidTransaction) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAccountId(accountId);
        transaction.setPlaidTransactionId(plaidTransaction.getTransactionId());
        transaction.setAmount(BigDecimal.valueOf(plaidTransaction.getAmount()));
        transaction.setDate(LocalDate.parse(plaidTransaction.getDate()));
        transaction.setName(plaidTransaction.getName());
        transaction.setPlaidCategory(plaidTransaction.getPersonalFinanceCategory().getPrimary());
        transaction.setMerchantName(plaidTransaction.getMerchantName());
        transaction.setPending(plaidTransaction.getPending());
        transaction.setPlaidCategory(plaidTransaction.getPersonalFinanceCategory().getPrimary());
        
        
        // Set location as JSON string
        if (plaidTransaction.getLocation() != null) {
            transaction.setLocation(gsonUtility.toJson(plaidTransaction.getLocation()));
        }
        
        // Set payment meta as JSON string
        if (plaidTransaction.getPaymentMeta() != null) {
            transaction.setPaymentMeta(gsonUtility.toJson(plaidTransaction.getPaymentMeta()));
        }
        
        return transaction;
    }
    
    /**
     * Update existing Transaction entity from Plaid transaction
     */
    private void updateTransactionFromPlaid(Transaction transaction, TransactionSyncResponse.Transaction plaidTransaction) {
        transaction.setAmount(BigDecimal.valueOf(plaidTransaction.getAmount()));
        transaction.setDate(LocalDate.parse(plaidTransaction.getDate()));
        transaction.setName(plaidTransaction.getName());
        transaction.setMerchantName(plaidTransaction.getMerchantName());
        transaction.setPending(plaidTransaction.getPending());
        transaction.setPlaidCategory(plaidTransaction.getPersonalFinanceCategory().getPrimary());
        
        // Update location
        if (plaidTransaction.getLocation() != null) {
            transaction.setLocation(gsonUtility.toJson(plaidTransaction.getLocation()));
        }
        
        // Update payment meta
        if (plaidTransaction.getPaymentMeta() != null) {
            transaction.setPaymentMeta(gsonUtility.toJson(plaidTransaction.getPaymentMeta()));
        }
    }
    
    
    /**
     * Get transactions for a user
     */
    public List<Transaction> getTransactionsForUser(UUID userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    /**
     * Get expense transactions for a user (amount < 0)
     */
    public List<Transaction> getExpenseTransactionsForUser(UUID userId) {
        return transactionRepository.findByUserIdAndAmountLessThanOrderByDateDesc(userId, BigDecimal.ZERO);
    }
    
    /**
     * Get transactions for a user within date range
     */
    public List<Transaction> getTransactionsForUser(UUID userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }
    
    /**
     * Get pending transactions for a user
     */
    public List<Transaction> getPendingTransactionsForUser(UUID userId) {
        return transactionRepository.findByUserIdAndPendingTrueOrderByDateDesc(userId);
    }
    
    /**
     * Get transaction by ID
     */
    public Optional<Transaction> getTransactionById(UUID transactionId) {
        return transactionRepository.findById(transactionId);
    }
    
    /**
     * Update transaction notes
     */
    @Transactional
    public Transaction updateTransactionNotes(UUID transactionId, String notes) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);
        if (transactionOpt.isPresent()) {
            Transaction transaction = transactionOpt.get();
            transaction.setNotes(notes);
            return transactionRepository.save(transaction);
        }
        throw new RuntimeException("Transaction not found: " + transactionId);
    }
}