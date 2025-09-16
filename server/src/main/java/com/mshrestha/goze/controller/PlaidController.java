package com.mshrestha.goze.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mshrestha.goze.dto.api.ApiResponse;
import com.mshrestha.goze.dto.plaid.*;
import com.mshrestha.goze.service.PlaidService;
import com.mshrestha.goze.security.JwtTokenUtil;
import com.mshrestha.goze.utils.GozeHttpUtility;
import com.mshrestha.goze.utils.GsonUtility;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
            
            // Extract userId from JWT token
            String userId = jwtTokenUtil.getUsernameFromToken(accessToken);
            
            // Create request with default values
            LinkTokenCreateRequest linkTokenRequest = new LinkTokenCreateRequest(
                userId,
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
            
            // Extract userId from JWT token
            String userId = jwtTokenUtil.getUsernameFromToken(accessToken);
            logger.info("Extracted userId from token: {}", userId);
            
            // Update request with extracted userId
            exchangeRequest.setUserId(userId);
            
            ExchangePublicTokenResponse response = plaidService.exchangePublicToken(exchangeRequest);
            logger.info("Successfully exchanged public token for user: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            logger.error("Failed to exchange public token", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error((ExchangePublicTokenResponse) null));
        }
    }

    @PostMapping("/create_item")
    public ResponseEntity<ApiResponse<CreateItemResponse>> storeAccessToken(
        @RequestBody CreateItemRequest storeAccessTokenRequest,
        HttpServletRequest request) {
        return null;
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
