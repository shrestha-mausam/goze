package com.mshrestha.goze.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mshrestha.goze.dto.api.ApiResponse;
import com.mshrestha.goze.dto.plaid.*;
import com.mshrestha.goze.model.PlaidItem;
import com.mshrestha.goze.model.User;
import com.mshrestha.goze.repository.UserRepository;
import com.mshrestha.goze.service.PlaidService;
import com.mshrestha.goze.security.JwtTokenUtil;
import com.mshrestha.goze.utils.GozeHttpUtility;
import com.mshrestha.goze.utils.GsonUtility;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plaid")
public class PlaidController {
    private static final Logger logger = LoggerFactory.getLogger(PlaidController.class);
    
    @Autowired
    private PlaidService plaidService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private GsonUtility gsonUtility;
    
    @Autowired
    private UserRepository userRepository;


    @PostMapping("/link_token/create")
    public ResponseEntity<ApiResponse<LinkTokenCreateResponse>> createLinkToken(
        HttpServletRequest request) {
        try {
            // Extract accessToken from HTTP cookies
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(request);
            if (accessToken == null || accessToken.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(null));
            }
            
            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            
            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Create request with default values using user UUID
            LinkTokenCreateRequest linkTokenRequest = new LinkTokenCreateRequest(
                user.getId().toString(),
                "Goze Financial App", // Default client name
                new String[]{"transactions"}, // Default products
                new String[]{"US"}, // Default country codes
                "en", // Default language
                null, // No webhook by default
                null  // No redirect URI by default
            );
            
            LinkTokenCreateResponse response = plaidService.createLinkToken(linkTokenRequest);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(null));
        }
    }

    @PostMapping("/public_token/exchange")
    public ResponseEntity<ApiResponse<ExchangePublicTokenResponse>> exchangePublicToken(
        @RequestBody ExchangePublicTokenRequest exchangeRequest,
        HttpServletRequest request) {
        try {
            logger.info("Received exchange public token request: {}", gsonUtility.toJson(exchangeRequest));
            
            // Extract accessToken from HTTP cookies
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(request);
            if (accessToken == null || accessToken.isEmpty()) {
                logger.warn("Access token not found in cookies");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error((ExchangePublicTokenResponse) null));
            }
            
            // Validate request
            if (exchangeRequest.getPublic_token() == null || exchangeRequest.getPublic_token().isEmpty()) {
                logger.warn("Public token is missing from request");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error((ExchangePublicTokenResponse) null));
            }
            
            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            logger.info("Extracted username from token: {}", username);
            
            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Update request with user UUID
            exchangeRequest.setUserId(user.getId().toString());
            logger.info("Set userId to: {}", user.getId());
            
            ExchangePublicTokenResponse response = plaidService.exchangePublicToken(exchangeRequest);
            logger.info("Successfully exchanged public token for user: {}", user.getId());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            logger.error("Failed to exchange public token", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error((ExchangePublicTokenResponse) null));
        }
    }

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<List<PlaidItem>>> getPlaidItems(HttpServletRequest request) {
        try {
            logger.info("Getting Plaid items for user");
            
            // Extract accessToken from HTTP cookies
            String accessToken = GozeHttpUtility.extractAccessTokenFromCookies(request);
            if (accessToken == null || accessToken.isEmpty()) {
                logger.warn("Access token not found in cookies");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(null));
            }
            
            // Extract username from JWT token
            String username = jwtTokenUtil.getUsernameFromToken(accessToken);
            
            // Look up user by username to get UUID
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            UUID userId = user.getId();
            logger.info("Extracted userId from token: {}", userId);
            
            // Get Plaid items for user
            List<PlaidItem> plaidItems = plaidService.getPlaidItemsForUser(userId);
            logger.info("Successfully retrieved {} Plaid items for user: {}", plaidItems.size(), userId);
            
            return ResponseEntity.ok(ApiResponse.success(plaidItems));
            
        } catch (Exception e) {
            logger.error("Failed to get Plaid items", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(null));
        }
    }
    
    /**
     * Example endpoint demonstrating Gson usage for JSON serialization/deserialization.
     * This method shows how to use GsonUtility for logging and debugging purposes.
     */
    @PostMapping("/example/gson-demo")
    public ResponseEntity<ApiResponse<String>> gsonDemo(
        @RequestBody ExchangePublicTokenRequest request) {
        try {
            // Log the incoming request using Gson for pretty formatting
            logger.info("Received request (pretty JSON):\n{}", gsonUtility.toPrettyJson(request));
            
            // Serialize to compact JSON for logging
            logger.info("Received request (compact JSON): {}", gsonUtility.toJson(request));
            
            // Example: Deserialize from JSON string (useful for processing raw JSON)
            String jsonString = gsonUtility.toJson(request);
            ExchangePublicTokenRequest deserialized = gsonUtility.fromJson(jsonString, ExchangePublicTokenRequest.class);
            
            // Verify deserialization worked
            if (deserialized != null && deserialized.getPublic_token() != null) {
                logger.info("Successfully deserialized request with token: {}", deserialized.getPublic_token());
                return ResponseEntity.ok(ApiResponse.success("Gson demo completed successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error((String) null));
            }
        } catch (Exception e) {
            logger.error("Gson demo failed", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error((String) null));
        }
    }
}
