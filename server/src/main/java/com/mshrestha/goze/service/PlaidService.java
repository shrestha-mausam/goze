package com.mshrestha.goze.service;

import com.mshrestha.goze.dto.plaid.*;
import com.mshrestha.goze.dto.plaid.api.*;
import com.mshrestha.goze.model.PlaidItem;
import com.mshrestha.goze.repository.PlaidItemRepository;
import com.mshrestha.goze.service.AccountService;
import com.mshrestha.goze.utils.PlaidRestUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class PlaidService {
    
    private static final Logger logger = LoggerFactory.getLogger(PlaidService.class);
    
    @Autowired
    private PlaidRestUtility plaidRestUtility;
    
    @Autowired
    private PlaidItemRepository plaidItemRepository;
    
    @Autowired
    private AccountService accountService;
    
    /**
     * Create a link token for Plaid Link
     */
    public LinkTokenCreateResponse createLinkToken(LinkTokenCreateRequest request) {
        try {
            logger.info("Creating link token for user: {}", request.getUserId());
            
            // Create the API request
            PlaidLinkTokenRequest apiRequest = new PlaidLinkTokenRequest(
                request.getClientName(),
                List.of("transactions"),
                List.of("US"),
                "en",
                new PlaidLinkTokenRequest.PlaidUser(request.getUserId()),
                request.getWebhook(),
                request.getRedirectUri()
            );
            
            // Call Plaid API
            PlaidLinkTokenResponse apiResponse = plaidRestUtility.createLinkToken(apiRequest);
            
            // Convert to internal response
            LinkTokenCreateResponse response = new LinkTokenCreateResponse(
                apiResponse.getLinkToken(),
                apiResponse.getExpiration()
            );
            
            logger.info("Successfully created link token for user: {}", request.getUserId());
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to create link token for user: {}", request.getUserId(), e);
            throw new RuntimeException("Failed to create link token: " + e.getMessage(), e);
        }
    }
    
    /**
     * Exchange public token for access token and save Plaid item
     */
    @Transactional
    public ExchangePublicTokenResponse exchangePublicToken(ExchangePublicTokenRequest request) {
        try {
            logger.info("Exchanging public token for user: {}", request.getUserId());
            
            // Create the API request
            PlaidExchangeTokenRequest apiRequest = new PlaidExchangeTokenRequest(request.getPublic_token());
            
            // Call Plaid API to exchange token
            PlaidExchangeTokenResponse plaidExchangeTokenResponse = plaidRestUtility.exchangePublicToken(apiRequest);
            
            // Get item information from Plaid
            PlaidItemRequest itemRequest = new PlaidItemRequest(plaidExchangeTokenResponse.getAccessToken());
            PlaidItemResponse itemResponse = plaidRestUtility.getItem(itemRequest);
            
            // Get institution information
            PlaidInstitutionResponse institutionResponse = null;
            if (itemResponse.getItem().getInstitutionId() != null) {
                PlaidInstitutionRequest institutionRequest = new PlaidInstitutionRequest(
                    itemResponse.getItem().getInstitutionId(),
                    new String[]{"US"}
                );
                institutionResponse = plaidRestUtility.getInstitution(institutionRequest);
            }
            
            // Save or update Plaid item in database
            UUID userId = UUID.fromString(request.getUserId());
            PlaidItem savedPlaidItem = saveOrUpdatePlaidItem(
                userId,
                plaidExchangeTokenResponse.getAccessToken(),
                itemResponse,
                institutionResponse
            );
            
            // Get and save accounts for the associated Plaid item
            fetchAndSaveAccounts(savedPlaidItem, plaidExchangeTokenResponse.getAccessToken());
            
            // Convert to internal response
            ExchangePublicTokenResponse response = new ExchangePublicTokenResponse(
                plaidExchangeTokenResponse.getAccessToken(),
                plaidExchangeTokenResponse.getItemId(),
                plaidExchangeTokenResponse.getRequestId()
            );
            
            logger.info("Successfully exchanged public token and saved Plaid item for user: {}", request.getUserId());
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to exchange public token for user: {}", request.getUserId(), e);
            throw new RuntimeException("Failed to exchange public token: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get all Plaid items for a user
     */
    public List<PlaidItem> getPlaidItemsForUser(UUID userId) {
        try {
            logger.info("Getting Plaid items for user: {}", userId);
            List<PlaidItem> items = plaidItemRepository.findByUserIdAndActiveTrue(userId);
            logger.info("Found {} active Plaid items for user: {}", items.size(), userId);
            return items;
        } catch (Exception e) {
            logger.error("Failed to get Plaid items for user: {}", userId, e);
            throw new RuntimeException("Failed to get Plaid items: " + e.getMessage(), e);
        }
    }
    
    /**
     * Sync transactions for a Plaid item
     */
    public TransactionSyncResponse syncTransactions(String accessToken, String cursor) {
        try {
            logger.info("Syncing transactions for access token: {}", accessToken.substring(0, 8) + "...");
            
            // Create the API request
            PlaidTransactionSyncRequest apiRequest = new PlaidTransactionSyncRequest(
                accessToken,
                cursor,
                null // count - use default
            );
            
            // Call Plaid API
            TransactionSyncResponse apiResponse = plaidRestUtility.syncTransactions(apiRequest);
            
            logger.info("Successfully synced transactions. Added: {}, Modified: {}, Removed: {}", 
                       apiResponse.getAdded() != null ? apiResponse.getAdded().size() : 0,
                       apiResponse.getModified() != null ? apiResponse.getModified().size() : 0,
                       apiResponse.getRemoved() != null ? apiResponse.getRemoved().size() : 0);
            
            return apiResponse;
            
        } catch (Exception e) {
            logger.error("Failed to sync transactions for access token: {}", accessToken.substring(0, 8) + "...", e);
            throw new RuntimeException("Failed to sync transactions: " + e.getMessage(), e);
        }
    }
    
    /**
     * Fetch accounts from Plaid and save them to database
     */
    private void fetchAndSaveAccounts(PlaidItem plaidItem, String accessToken) {
        try {
            logger.info("Fetching accounts for Plaid item: {} (user: {})", 
                       plaidItem.getItemId(), plaidItem.getUserId());
            
            // Create the accounts request
            PlaidAccountsRequest accountsRequest = new PlaidAccountsRequest(accessToken);
            
            // Call Plaid API to get accounts
            PlaidAccountsResponse accountsResponse = plaidRestUtility.getAccounts(accountsRequest);
            
            // Process and save accounts
            accountService.processAccountsFromPlaid(plaidItem.getUserId(), plaidItem.getId(), accountsResponse);
            
            logger.info("Successfully fetched and saved {} accounts for Plaid item: {}", 
                       accountsResponse.getAccounts() != null ? accountsResponse.getAccounts().size() : 0,
                       plaidItem.getItemId());
            
        } catch (Exception e) {
            logger.error("Failed to fetch accounts for Plaid item: {}", plaidItem.getItemId(), e);
            throw new RuntimeException("Failed to fetch accounts: " + e.getMessage(), e);
        }
    }
    
    /**
     * Save or update Plaid item in database
     */
    private PlaidItem saveOrUpdatePlaidItem(
            UUID userId,
            String accessToken,
            PlaidItemResponse itemResponse,
            PlaidInstitutionResponse institutionResponse) {
        
        try {
            // Check if item already exists
            PlaidItem existingItem = plaidItemRepository
                .findByUserIdAndItemId(userId, itemResponse.getItem().getItemId())
                .orElse(null);
            
            PlaidItem plaidItem;
            if (existingItem != null) {
                // Update existing item
                plaidItem = existingItem;
                plaidItem.setAccessToken(accessToken);
                logger.info("Updating existing Plaid item: {}", plaidItem.getItemId());
            } else {
                // Create new item
                plaidItem = new PlaidItem();
                plaidItem.setUserId(userId);
                plaidItem.setItemId(itemResponse.getItem().getItemId());
                plaidItem.setAccessToken(accessToken);
                logger.info("Creating new Plaid item: {}", plaidItem.getItemId());
            }
            
            // Set item information
            if (itemResponse.getItem() != null) {
                plaidItem.setInstitutionId(itemResponse.getItem().getInstitutionId());
            }
            
            // Set institution information
            if (institutionResponse != null && institutionResponse.getInstitution() != null) {
                plaidItem.setInstitutionName(institutionResponse.getInstitution().getName());
            }
            
            // Save to database
            PlaidItem savedItem = plaidItemRepository.save(plaidItem);
            logger.info("Successfully saved Plaid item: {} for user: {}", savedItem.getItemId(), userId);
            
            return savedItem;
            
        } catch (Exception e) {
            logger.error("Failed to save Plaid item for user: {}", userId, e);
            throw new RuntimeException("Failed to save Plaid item: " + e.getMessage(), e);
        }
    }
}
