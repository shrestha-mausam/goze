package com.mshrestha.goze.utils;

import com.mshrestha.goze.dto.plaid.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PlaidRestUtility {
    
    private static final Logger logger = LoggerFactory.getLogger(PlaidRestUtility.class);
    
    @Autowired
    private GsonUtility gsonUtility;
    
    @Value("${plaid.client-id}")
    private String clientId;
    
    @Value("${plaid.secret}")
    private String secret;
    
    @Value("${plaid.environment}")
    private String environment;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Get the base URL for Plaid API based on environment
     */
    private String getBaseUrl() {
        switch (environment.toLowerCase()) {
            case "sandbox":
                return "https://sandbox.plaid.com";
            case "production":
                return "https://production.plaid.com";
            default:
                return "https://sandbox.plaid.com";
        }
    }
    
    /**
     * Create standard headers for Plaid API requests
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("PLAID-CLIENT-ID", clientId);
        headers.set("PLAID-SECRET", secret);
        headers.set("Plaid-Version", "2020-09-14");
        return headers;
    }
    
    /**
     * Create link token for Plaid Link
     */
    public PlaidLinkTokenResponse createLinkToken(PlaidLinkTokenRequest request) {
        try {
            String url = getBaseUrl() + "/link/token/create";
            
            logger.info("Creating link token for user: {}", request.getUser().getClientUserId());
            logger.debug("Link token request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                PlaidLinkTokenResponse linkTokenResponse = gsonUtility.fromJson(response.getBody(), PlaidLinkTokenResponse.class);
                logger.info("Successfully created link token for user: {}", request.getUser().getClientUserId());
                return linkTokenResponse;
            } else {
                logger.error("Failed to create link token. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to create link token");
            }
        } catch (Exception e) {
            logger.error("Exception while creating link token for user: {}", request.getUser().getClientUserId(), e);
            throw new RuntimeException("Failed to create link token: " + e.getMessage(), e);
        }
    }
    
    /**
     * Exchange public token for access token
     */
    public PlaidExchangeTokenResponse exchangePublicToken(PlaidExchangeTokenRequest request) {
        try {
            String url = getBaseUrl() + "/item/public_token/exchange";
            
            logger.info("Exchanging public token for access token");
            logger.debug("Exchange token request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                PlaidExchangeTokenResponse exchangeResponse = gsonUtility.fromJson(response.getBody(), PlaidExchangeTokenResponse.class);
                logger.info("Successfully exchanged public token for access token. Item ID: {}", exchangeResponse.getItemId());
                return exchangeResponse;
            } else {
                logger.error("Failed to exchange public token. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to exchange public token");
            }
        } catch (Exception e) {
            logger.error("Exception while exchanging public token", e);
            throw new RuntimeException("Failed to exchange public token: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get item information from Plaid
     */
    public PlaidItemResponse getItem(PlaidItemRequest request) {
        try {
            String url = getBaseUrl() + "/item/get";
            
            logger.info("Getting item information for access token");
            logger.debug("Item request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                PlaidItemResponse itemResponse = gsonUtility.fromJson(response.getBody(), PlaidItemResponse.class);
                logger.info("Successfully retrieved item information. Item ID: {}", itemResponse.getItem().getItemId());
                return itemResponse;
            } else {
                logger.error("Failed to get item information. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to get item information");
            }
        } catch (Exception e) {
            logger.error("Exception while getting item information", e);
            throw new RuntimeException("Failed to get item information: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get institution information from Plaid
     */
    public PlaidInstitutionResponse getInstitution(PlaidInstitutionRequest request) {
        try {
            String url = getBaseUrl() + "/institutions/get_by_id";
            
            logger.info("Getting institution information for ID: {}", request.getInstitutionId());
            logger.debug("Institution request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                PlaidInstitutionResponse institutionResponse = gsonUtility.fromJson(response.getBody(), PlaidInstitutionResponse.class);
                logger.info("Successfully retrieved institution information. Name: {}", institutionResponse.getInstitution().getName());
                return institutionResponse;
            } else {
                logger.error("Failed to get institution information. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to get institution information");
            }
        } catch (Exception e) {
            logger.error("Exception while getting institution information", e);
            throw new RuntimeException("Failed to get institution information: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get accounts from Plaid
     */
    public PlaidAccountsResponse getAccounts(PlaidAccountsRequest request) {
        try {
            String url = getBaseUrl() + "/accounts/get";
            
            logger.info("Getting accounts for access token");
            logger.debug("Accounts request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                PlaidAccountsResponse accountsResponse = gsonUtility.fromJson(response.getBody(), PlaidAccountsResponse.class);
                logger.info("Successfully retrieved {} accounts", accountsResponse.getAccounts() != null ? accountsResponse.getAccounts().size() : 0);
                return accountsResponse;
            } else {
                logger.error("Failed to get accounts. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to get accounts");
            }
        } catch (Exception e) {
            logger.error("Exception while getting accounts", e);
            throw new RuntimeException("Failed to get accounts: " + e.getMessage(), e);
        }
    }
    
    /**
     * Sync transactions from Plaid
     */
    public TransactionSyncResponse syncTransactions(PlaidTransactionSyncRequest request) {
        try {
            String url = getBaseUrl() + "/transactions/sync";
            
            logger.info("Syncing transactions for access token");
            logger.debug("Transaction sync request: {}", gsonUtility.toPrettyJson(request));
            
            HttpEntity<String> entity = new HttpEntity<>(gsonUtility.toJson(request), createHeaders());
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                TransactionSyncResponse syncResponse = gsonUtility.fromJson(response.getBody(), TransactionSyncResponse.class);
                logger.info("Successfully synced transactions. Added: {}, Modified: {}, Removed: {}", 
                           syncResponse.getAdded() != null ? syncResponse.getAdded().size() : 0,
                           syncResponse.getModified() != null ? syncResponse.getModified().size() : 0,
                           syncResponse.getRemoved() != null ? syncResponse.getRemoved().size() : 0);
                return syncResponse;
            } else {
                logger.error("Failed to sync transactions. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to sync transactions");
            }
        } catch (Exception e) {
            logger.error("Exception while syncing transactions", e);
            throw new RuntimeException("Failed to sync transactions: " + e.getMessage(), e);
        }
    }
}