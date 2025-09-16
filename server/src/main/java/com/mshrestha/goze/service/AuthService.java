package com.mshrestha.goze.service;

import com.mshrestha.goze.utils.exception.RateLimitExceededException;
import com.mshrestha.goze.model.User;
import com.mshrestha.goze.repository.UserRepository;
import com.mshrestha.goze.security.JwtTokenUtil;
import com.mshrestha.goze.security.JwtUserDetailsService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mshrestha.goze.dto.auth.JwtTokenResponse;
import com.mshrestha.goze.dto.auth.LoginRequest;
import com.mshrestha.goze.dto.auth.RegisterRequest;
import com.mshrestha.goze.utils.exception.InvalidTokenException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service handling authentication business logic.
 * 
 * This service provides methods for:
 * - User authentication
 * - User registration
 * - Token management
 * - Rate limiting
 */
@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    // Rate limiting - allow 5 requests per minute per IP
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Creates a rate limiting bucket for an IP address.
     * Limits to 5 requests per minute.
     * 
     * @return A configured rate limiting bucket
     */
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
    
    /**
     * Extracts the client IP address from the request.
     * Handles X-Forwarded-For header for clients behind proxies.
     * 
     * @param request The HTTP request
     * @return The client's IP address
     */
    public String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
    
    /**
     * Checks if the request is rate limited.
     * Throws RateLimitExceededException if limit is exceeded.
     * 
     * @param clientIP The client's IP address
     * @throws RateLimitExceededException if rate limit is exceeded
     */
    public void checkRateLimit(String clientIP) {
        Bucket bucket = buckets.computeIfAbsent(clientIP, k -> createNewBucket());
        
        if (!bucket.tryConsume(1)) {
            logger.warn("Rate limit exceeded for IP: {}", clientIP);
            throw new RateLimitExceededException("Too many login attempts. Please try again later.");
        }
    }
    
    /**
     * Authenticates a user and returns JWT tokens.
     * 
     * @param loginRequest {@link LoginRequest} containing username and password
     * @return {@link JwtTokenResponse} containing access and refresh tokens
     * @throws UsernameNotFoundException if user not found
     * @throws AuthenticationException if authentication fails
     */
    public JwtTokenResponse loginUser(LoginRequest loginRequest ) throws  UsernameNotFoundException, AuthenticationException{
        authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        
        final String accessToken = jwtTokenUtil.generateToken(loginRequest.getUsername());
        final String refreshToken = jwtTokenUtil.generateRefreshToken(loginRequest.getUsername());
        
        // Update last login time
        userDetailsService.updateLastLogin(loginRequest.getUsername());
        
        logger.info("User logged in successfully: {}", loginRequest.getUsername());
        
        return new JwtTokenResponse(accessToken, refreshToken);
    }
    
    /**
     * Registers a new user and generates authentication tokens.
     * 
     * @param registerRequest {@link RegisterRequest} containing user registration details
     * @return {@link JwtTokenResponse} containing access and refresh tokens for the new user
     */
    public JwtTokenResponse registerUser(RegisterRequest registerRequest) {
        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        userRepository.save(user);
        logger.info("New user registered: {}", registerRequest.getUsername());

        final String accessToken = jwtTokenUtil.generateToken(registerRequest.getUsername());
        final String refreshToken = jwtTokenUtil.generateRefreshToken(registerRequest.getUsername());

        return new JwtTokenResponse(accessToken, refreshToken);
    }
    
    /**
     * Checks if a username already exists.
     * 
     * @param username Username to check
     * @return true if username exists, false otherwise
     */
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * Checks if an email already exists.
     * 
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Refreshes both access and refresh tokens.
     * 
     * @param refreshToken The refresh token
     * @return A JwtTokenResponse containing new access and refresh tokens
     * @throws InvalidTokenException if refresh token is invalid
     */
    public JwtTokenResponse refreshToken(String refreshToken) {
        try {
            // Extract username from refresh token
            String username = jwtTokenUtil.getUsernameFromToken(refreshToken);
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Validate refresh token
            if (jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                // Generate new tokens
                String newAccessToken = jwtTokenUtil.generateToken(username);
                String newRefreshToken = jwtTokenUtil.generateRefreshToken(username);
                
                logger.info("Tokens refreshed for user: {}", username);
                
                // Return both new tokens
                return new JwtTokenResponse(newAccessToken, newRefreshToken);
            } else {
                logger.warn("Invalid refresh token for user: {}", username);
                throw new InvalidTokenException("Invalid refresh token");
            }
        } catch (Exception e) {
            logger.error("Error refreshing token", e);
            throw new InvalidTokenException("Invalid refresh token");
        }
    }
    
    /**
     * Validates a token.
     * 
     * @param token The JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) throws InvalidTokenException {
        try {
            jwtTokenUtil.validateTokenSignatureAndExpiration(token);
            // extract the username and 
            String username = jwtTokenUtil.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            return jwtTokenUtil.validateToken(token, userDetails);
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature", e);
            throw new InvalidTokenException("JWT signature validation failed");
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token", e);
            throw new InvalidTokenException("JWT token is malformed");
        } catch (ExpiredJwtException e) {
            logger.error("JWT token has expired", e);
            throw new InvalidTokenException("JWT token has expired");
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token", e);
            throw new InvalidTokenException("JWT token format is not supported");
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty", e);
            throw new InvalidTokenException("JWT token is invalid");
        } catch (Exception e) {
            logger.error("JWT validation error", e);
            throw new InvalidTokenException("Error processing JWT token");
        }
    }
    
    /**
     * Authenticates a user with username and password.
     * 
     * @param username Username or email
     * @param password User's password
     * @throws Exception if authentication fails
     */
    public void authenticate(String username, String password) throws AuthenticationException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new DisabledException("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            // Increment failed login attempts
            userDetailsService.incrementFailedLoginAttempts(username);
            logger.warn("Failed login attempt for user: {}", username);
            throw new BadCredentialsException("INVALID_CREDENTIALS", e);
        }
    }
    
    public Date getTokenExpirationDate(String token) {
        return jwtTokenUtil.getExpirationDateFromToken(token);
    }
} 