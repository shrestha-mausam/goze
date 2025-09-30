package com.mshrestha.goze.service;

import com.mshrestha.goze.dto.plaid.api.PlaidAccountsResponse;
import com.mshrestha.goze.model.Account;
import com.mshrestha.goze.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {
    
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    
    @Autowired
    private AccountRepository accountRepository;
    
    /**
     * Process accounts from Plaid and save them to database
     */
    @Transactional
    public void processAccountsFromPlaid(UUID userId, UUID plaidItemId, PlaidAccountsResponse accountsResponse) {
        try {
            logger.info("Processing {} accounts for user: {}, plaid item: {}", 
                       accountsResponse.getAccounts() != null ?
                       accountsResponse.getAccounts().size() : 0, userId, plaidItemId);
            
            if (accountsResponse.getAccounts() != null) {
                for (PlaidAccountsResponse.PlaidAccount plaidAccount : accountsResponse.getAccounts()) {
                    try {
                        processAccount(userId, plaidItemId, plaidAccount);
                    } catch (Exception e) {
                        logger.error("Failed to process account: {} for user: {}", 
                                   plaidAccount.getAccountId(), userId, e);
                    }
                }
            }
            
            logger.info("Successfully processed accounts for user: {}, plaid item: {}", userId, plaidItemId);
            
        } catch (Exception e) {
            logger.error("Failed to process accounts for user: {}, plaid item: {}", userId, plaidItemId, e);
            throw new RuntimeException("Failed to process accounts: " + e.getMessage(), e);
        }
    }
    
    /**
     * Process individual account from Plaid response
     */
    private void processAccount(UUID userId, UUID plaidItemId, PlaidAccountsResponse.PlaidAccount plaidAccount) {
        try {
            // Check if account already exists
            Optional<Account> existingAccount = accountRepository
                .findByUserIdAndAccountId(userId, plaidAccount.getAccountId());
            
            Account account;
            if (existingAccount.isPresent()) {
                // Update existing account
                account = existingAccount.get();
                logger.info("Updating existing account: {}", plaidAccount.getAccountId());
            } else {
                // Create new account
                account = new Account();
                account.setUserId(userId);
                account.setPlaidItemId(plaidItemId);
                account.setAccountId(plaidAccount.getAccountId());
                logger.info("Creating new account: {}", plaidAccount.getAccountId());
            }
            
            // Update/Set account information
            updateAccountFromPlaid(account, plaidAccount);
            
            // Save to database
            accountRepository.save(account);
            
            logger.debug("Successfully saved account: {} for user: {}", account.getAccountId(), userId);
            
        } catch (Exception e) {
            logger.error("Failed to process account: {}", plaidAccount.getAccountId(), e);
            throw e;
        }
    }
    
    /**
     * Update Account entity from Plaid account data
     */
    private void updateAccountFromPlaid(Account account, PlaidAccountsResponse.PlaidAccount plaidAccount) {
        // Basic information
        account.setName(plaidAccount.getName());
        account.setMask(plaidAccount.getMask());
        account.setOfficialName(plaidAccount.getOfficialName());
        account.setType(plaidAccount.getType());
        account.setSubtype(plaidAccount.getSubtype());
        
        // Balance information
        if (plaidAccount.getBalances() != null) {
            if (plaidAccount.getBalances().getCurrent() != null) {
                account.setCurrentBalance(BigDecimal.valueOf(plaidAccount.getBalances().getCurrent()));
            }
            if (plaidAccount.getBalances().getAvailable() != null) {
                account.setAvailableBalance(BigDecimal.valueOf(plaidAccount.getBalances().getAvailable()));
            }
            if (plaidAccount.getBalances().getIsoCurrencyCode() != null) {
                account.setCurrencyCode(plaidAccount.getBalances().getIsoCurrencyCode());
            }
        }
    }
    
    /**
     * Get all accounts for a user
     */
    public List<Account> getAccountsForUser(UUID userId) {
        return accountRepository.findByUserIdOrderByLastUpdatedDesc(userId);
    }
    
    /**
     * Get all active accounts for a user
     */
    public List<Account> getActiveAccountsForUser(UUID userId) {
        return accountRepository.findByUserIdAndActiveTrue(userId);
    }
    
    /**
     * Get all accounts for a Plaid item
     */
    public List<Account> getAccountsForPlaidItem(UUID plaidItemId) {
        return accountRepository.findByPlaidItemId(plaidItemId);
    }
    
    /**
     * Get account by account ID
     */
    public Optional<Account> getAccountByAccountId(UUID userId, String accountId) {
        return accountRepository.findByUserIdAndAccountId(userId, accountId);
    }
    
    /**
     * Update account balance
     */
    @Transactional
    public Account updateAccountBalance(UUID userId, String accountId, BigDecimal currentBalance, BigDecimal availableBalance) {
        Optional<Account> accountOpt = accountRepository.findByUserIdAndAccountId(userId, accountId);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            account.setCurrentBalance(currentBalance);
            account.setAvailableBalance(availableBalance);
            return accountRepository.save(account);
        }
        throw new RuntimeException("Account not found: " + accountId);
    }
}