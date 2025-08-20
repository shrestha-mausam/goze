package com.mshrestha.goze.controller;

import com.mshrestha.goze.service.AuthService;
import com.mshrestha.goze.utils.exception.DuplicateResourceException;
import com.mshrestha.goze.utils.exception.InvalidTokenException;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.Date;

import com.mshrestha.goze.dto.api.ApiResponse;
import com.mshrestha.goze.dto.auth.JwtTokenResponse;
import com.mshrestha.goze.dto.auth.LoginRequest;
import com.mshrestha.goze.dto.auth.RegisterRequest;
import com.mshrestha.goze.dto.auth.RefreshTokenRequest;
import com.mshrestha.goze.dto.auth.ValidateTokenRequest;
import com.mshrestha.goze.dto.auth.ValidateTokenResponse;

/**
 * Controller handling authentication-related endpoints.
 * 
 * This controller provides endpoints for user authentication operations including:
 * - User login
 * - User registration
 * - Token refresh
 * - Token validation
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    /**
     * Authenticates a user and provides JWT tokens.
     * 
     * @param loginRequest Contains username/email and password
     * @param request The HTTP request (used for rate limiting by IP)
     * @return JWT access and refresh tokens on success, or appropriate error response
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtTokenResponse>> loginUser(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) throws Exception {
        
        // Check rate limit
        authService.checkRateLimit(authService.getClientIP(request));
        
        // Authenticate user - let exceptions propagate to GlobalExceptionHandler
        JwtTokenResponse tokenResponse = authService.loginUser(loginRequest);
        
        // Create the response entity with headers in one step
        return ResponseEntity.ok(ApiResponse.success(tokenResponse));
    }
    
    /**
     * Registers a new user in the system.
     * 
     * @param registerRequest User registration details
     * @return Success message or error if username/email already exists
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtTokenResponse>> registerUser(
            @RequestBody RegisterRequest registerRequest,
            HttpServletRequest request) {

        // Check rate limit
        authService.checkRateLimit(authService.getClientIP(request));
        
        // Check if username exists
        if (authService.usernameExists(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }
        
        // Check if email exists
        if (authService.emailExists(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        
        // Register user
        JwtTokenResponse tokenResponse = authService.registerUser(registerRequest);
        
        return ResponseEntity.ok(ApiResponse.success(tokenResponse));
    }


    
    /**
     * Refreshes an access token using a refresh token.
     * 
     * @param refreshRequest Contains the refresh token
     * @return A new access token and refresh token if the original refresh token is valid
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtTokenResponse>> refreshToken(
            @RequestBody RefreshTokenRequest refreshRequest,
            HttpServletRequest request) {
        
        // Validate and generate new tokens
        JwtTokenResponse tokenResponse = authService.refreshToken(refreshRequest.getRefreshToken());
        
        // Create cookies for both new tokens
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", tokenResponse.getAccessToken())
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .maxAge(Duration.ofHours(1)) // 1 hour
            .build();
        
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .maxAge(Duration.ofHours(1)) // 1 hour
            .build();
        
        var response = ResponseEntity.ok(ApiResponse.success(tokenResponse));
        // Add cookies to response
        response.getHeaders().add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        
        return response;
    }
    
    /**
     * Validates a JWT token.
     * 
     * @param validateRequest Contains the access token to validate
     * @return Boolean indicating if the token is valid
     */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<ValidateTokenResponse>> validateToken(
            @RequestBody ValidateTokenRequest validateRequest) {
        
        boolean isValid = authService.validateToken(validateRequest.getAccessToken());
        if(!isValid){
            throw new InvalidTokenException("Invalid token");
        }
        Date expirationDate = authService.getTokenExpirationDate(validateRequest.getAccessToken());
        ValidateTokenResponse validateTokenResponse = new ValidateTokenResponse(expirationDate.toString());
        
        return ResponseEntity.ok(ApiResponse.success(validateTokenResponse));
    }
}
