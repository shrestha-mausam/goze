package com.mshrestha.goze.controller;

import com.mshrestha.goze.dto.api.ApiResponse;
import com.mshrestha.goze.dto.dashboard.GetAllAccountsRequest;
import com.mshrestha.goze.dto.dashboard.GetAllAccountsResponse;
import com.mshrestha.goze.dto.dashboard.GetAllTransactionsRequest;
import com.mshrestha.goze.dto.dashboard.GetAllTransactionsResponse;
import com.mshrestha.goze.dto.dashboard.GetExpenseTransactionsRequest;
import com.mshrestha.goze.dto.dashboard.GetExpenseTransactionsResponse;
import com.mshrestha.goze.model.Account;
import com.mshrestha.goze.model.Transaction;
import com.mshrestha.goze.model.User;
import com.mshrestha.goze.repository.UserRepository;
import com.mshrestha.goze.service.AccountService;
import com.mshrestha.goze.service.TransactionService;
import com.mshrestha.goze.security.JwtTokenUtil;
import com.mshrestha.goze.utils.GsonUtility;
import com.mshrestha.goze.utils.GozeHttpUtility;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private GsonUtility gsonUtility;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get all accounts for the authenticated user
     */
    @PostMapping("/accounts/get/all")
    public ResponseEntity<String> getAllAccounts(
            HttpServletRequest httpRequest,
            @RequestBody GetAllAccountsRequest request) {
        
        try {
            logger.info("Received request to get all accounts");
            logger.debug("Request body: {}", gsonUtility.toPrettyJson(request));
            
            // Extract access token from cookies (consistent with other controllers)
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(httpRequest);
            if (accessToken == null) {
                logger.error("No access token found in request");
                return ResponseEntity.status(401).body(gsonUtility.toPrettyJson(
                    ApiResponse.error("Access token is required")));
            }
            
            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            logger.info("Extracted username from token: {}", username);
            
            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Use the user ID from the authenticated user (from JWT token)
            UUID userId = user.getId();
            logger.info("Using userId from authenticated user: {}", userId);
            
            // Get all accounts for the authenticated user
            List<Account> accounts = accountService.getAccountsForUser(userId);
            logger.info("Found {} accounts for user: {}", accounts.size(), userId);
            
            // Convert Account entities to DTOs
            List<GetAllAccountsResponse.AccountDto> accountDtos = accounts.stream()
                .map(this::convertAccountToDto)
                .collect(Collectors.toList());
            
            // Create response
            GetAllAccountsResponse response = new GetAllAccountsResponse(
                accountDtos,
                accountDtos.size()
            );
            
            logger.info("Successfully retrieved {} accounts for user: {}", accounts.size(), userId);
            return ResponseEntity.ok(gsonUtility.toPrettyJson(ApiResponse.success(response)));
            
        } catch (Exception e) {
            logger.error("Failed to get accounts", e);
            return ResponseEntity.status(500).body(gsonUtility.toPrettyJson(
                ApiResponse.error("Failed to get accounts: " + e.getMessage())));
        }
    }

    /**
     * Convert Account entity to AccountDto
     */
    private GetAllAccountsResponse.AccountDto convertAccountToDto(Account account) {
        return new GetAllAccountsResponse.AccountDto(
            account.getPlaidItemId(),
            account.getAccountId(),
            account.getName(),
            account.getMask(),
            account.getOfficialName(),
            account.getType(),
            account.getSubtype(),
            account.getCurrentBalance(),
            account.getAvailableBalance(),
            account.getCurrencyCode(),
            account.getActive(),
            account.getLastUpdated() != null ? account.getLastUpdated().toString() : null
        );
    }

    /**
     * Get all transactions for the authenticated user
     */
    @PostMapping("/transactions/get/all")
    public ResponseEntity<String> getAllTransactions(
            HttpServletRequest httpRequest,
            @RequestBody GetAllTransactionsRequest request) {
        
        try {
            logger.info("Received request to get all transactions");
            logger.debug("Request body: {}", gsonUtility.toPrettyJson(request));
            
            // Extract access token from cookies (consistent with other controllers)
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(httpRequest);
            if (accessToken == null) {
                logger.error("No access token found in request");
                return ResponseEntity.status(401).body(gsonUtility.toPrettyJson(
                    ApiResponse.error("Access token is required")));
            }
            
            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            logger.info("Extracted username from token: {}", username);
            
            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Use the user ID from the authenticated user (from JWT token)
            UUID userId = user.getId();
            logger.info("Using userId from authenticated user: {}", userId);
            
            // Note: We ignore any userId from the request body for security
            // The userId is always extracted from the JWT token to prevent access to other users' data
            
            // Get all transactions for the authenticated user
            List<Transaction> transactions = transactionService.getTransactionsForUser(userId);
            logger.info("Found {} transactions for user: {}", transactions.size(), userId);
            
            // NEW: Get all accounts for the user
            List<Account> accounts = accountService.getAccountsForUser(userId);
            
            // NEW: Create account map for efficient lookup
            Map<String, String> accountMap = accounts.stream()
                .collect(Collectors.toMap(
                    account -> account.getAccountId(),
                    Account::getName,
                    (existing, replacement) -> existing  // Handle duplicates
                ));
            
            // Convert Transaction entities to DTOs with account names
            List<GetAllTransactionsResponse.TransactionDto> transactionDtos = transactions.stream()
                .map(tx -> convertToDto(tx, accountMap))
                .collect(Collectors.toList());
            
            // Create response
            GetAllTransactionsResponse response = new GetAllTransactionsResponse(
                transactionDtos,
                transactionDtos.size()
            );
            
            logger.info("Successfully retrieved {} transactions for user: {}", transactions.size(), userId);
            return ResponseEntity.ok(gsonUtility.toPrettyJson(ApiResponse.success(response)));
            
        } catch (Exception e) {
            logger.error("Failed to get transactions", e);
            return ResponseEntity.status(500).body(gsonUtility.toPrettyJson(
                ApiResponse.error("Failed to get transactions: " + e.getMessage())));
        }
    }
    
    /**
     * Convert Transaction entity to TransactionDto with account name
     */
    private GetAllTransactionsResponse.TransactionDto convertToDto(
            Transaction transaction, 
            Map<String, String> accountMap) {
        
        // Look up account name, default to "Unknown Account" if not found
        String accountName = accountMap.getOrDefault(
            transaction.getAccountId().toString(), 
            "Unknown Account"
        );
        
        return new GetAllTransactionsResponse.TransactionDto(
            transaction.getAccountId(),
            accountName,  // NEW: Add account name
            transaction.getPlaidTransactionId(),
            transaction.getAmount(),
            transaction.getDate() != null ? transaction.getDate().toString() : null,
            transaction.getName(),
            transaction.getMerchantName(),
            transaction.getPending(),
            transaction.getPlaidCategory(),
            transaction.getLocation(),
            transaction.getPaymentMeta(),
            transaction.getNotes(),
            transaction.getExcludedFromBudget(),
            transaction.getCreatedAt() != null ? transaction.getCreatedAt().toString() : null,
            transaction.getUpdatedAt() != null ? transaction.getUpdatedAt().toString() : null
        );
    }
    
    /**
     * Get expense transactions for the authenticated user
     */
    @PostMapping("/transactions/get/expenses")
    public ResponseEntity<String> getExpenseTransactions(
            HttpServletRequest httpRequest,
            @RequestBody GetExpenseTransactionsRequest request) {

        try {
            logger.info("Received request to get expense transactions");
            logger.debug("Request body: {}", gsonUtility.toPrettyJson(request));

            // Extract access token from cookies (consistent with other controllers)
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(httpRequest);
            if (accessToken == null) {
                logger.error("No access token found in request");
                return ResponseEntity.status(401).body(gsonUtility.toPrettyJson(
                    ApiResponse.error("Access token is required")));
            }

            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            logger.info("Extracted username from token: {}", username);

            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // Use the user ID from the authenticated user (from JWT token)
            UUID userId = user.getId();
            logger.info("Using userId from authenticated user: {}", userId);

            // Get expense transactions for the authenticated user
            List<Transaction> transactions = transactionService.getExpenseTransactionsForUser(userId);
            logger.info("Found {} expense transactions for user: {}", transactions.size(), userId);

            // NEW: Get all accounts for the user
            List<Account> accounts = accountService.getAccountsForUser(userId);
            
            // NEW: Create account map for efficient lookup
            Map<String, String> accountMap = accounts.stream()
                .collect(Collectors.toMap(
                    account -> account.getAccountId(),
                    Account::getName,
                    (existing, replacement) -> existing
                ));

            // Convert Transaction entities to DTOs with account names
            List<GetExpenseTransactionsResponse.TransactionDto> transactionDtos = transactions.stream()
                .map(tx -> convertExpenseTransactionToDto(tx, accountMap))
                .collect(Collectors.toList());

            // Create response
            GetExpenseTransactionsResponse response = new GetExpenseTransactionsResponse(
                transactionDtos,
                transactionDtos.size()
            );

            logger.info("Successfully retrieved {} expense transactions for user: {}", transactions.size(), userId);
            return ResponseEntity.ok(gsonUtility.toPrettyJson(ApiResponse.success(response)));

        } catch (Exception e) {
            logger.error("Failed to get expense transactions", e);
            return ResponseEntity.status(500).body(gsonUtility.toPrettyJson(
                ApiResponse.error("Failed to get expense transactions: " + e.getMessage())));
        }
    }

    /**
     * Convert Transaction entity to ExpenseTransactionDto with account name
     */
    private GetExpenseTransactionsResponse.TransactionDto convertExpenseTransactionToDto(
            Transaction transaction,
            Map<String, String> accountMap) {
        
        // Look up account name, default to "Unknown Account" if not found
        String accountName = accountMap.getOrDefault(
            transaction.getAccountId(),
            "Unknown Account"
        );
        
        return new GetExpenseTransactionsResponse.TransactionDto(
            transaction.getAccountId(),
            accountName,  // NEW: Add account name
            transaction.getPlaidTransactionId(),
            transaction.getAmount(),
            transaction.getDate() != null ? transaction.getDate().toString() : null,
            transaction.getName(),
            transaction.getMerchantName(),
            transaction.getPending(),
            transaction.getPlaidCategory(),
            transaction.getLocation(),
            transaction.getPaymentMeta(),
            transaction.getNotes(),
            transaction.getExcludedFromBudget(),
            transaction.getCreatedAt() != null ? transaction.getCreatedAt().toString() : null,
            transaction.getUpdatedAt() != null ? transaction.getUpdatedAt().toString() : null
        );
    }
}