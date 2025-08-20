package com.mshrestha.goze.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT token operations.
 * 
 * This class handles:
 * - JWT token generation
 * - Token validation
 * - Claims extraction
 */
@Component
public class JwtTokenUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    /**
     * Validates a token's signature and checks if it's expired.
     * Throws exceptions instead of catching them to allow the caller to handle them.
     * 
     * @param token JWT token to validate
     * @throws SecurityException if the signature is invalid
     * @throws MalformedJwtException if the token is malformed
     * @throws ExpiredJwtException if the token is expired
     * @throws UnsupportedJwtException if the token is unsupported
     * @throws IllegalArgumentException if the token is null or empty
     */
    public void validateTokenSignatureAndExpiration(String token) 
            throws SecurityException, MalformedJwtException, ExpiredJwtException, 
                   UnsupportedJwtException, IllegalArgumentException {
        
        // This will throw an exception if the token is invalid
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token);
        
        // Check if token is expired
        Date expiration = getExpirationDateFromToken(token);
        if (expiration.before(new Date())) {
            throw new ExpiredJwtException(null, null, "JWT token has expired");
        }
    }

    /**
     * Generates a signing key from the secret.
     * Handles Base64 encoded secrets.
     * 
     * @return The signing key
     */
    private Key getSigningKey() {
        try {
            // Try to decode as Base64 first
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            // If not Base64, use as raw bytes (for backward compatibility)
            return Keys.hmacShaKeyFor(secret.getBytes());
        }
    }

    /**
     * Extracts username from token.
     * 
     * @param token JWT token
     * @return Username from token
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * Extracts expiration date from token.
     * 
     * @param token JWT token
     * @return Expiration date
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from token.
     * 
     * @param token JWT token
     * @param claimsResolver Function to extract specific claim
     * @return The extracted claim
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from token.
     * 
     * @param token JWT token
     * @return All claims
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if token is expired.
     * 
     * @param token JWT token
     * @return true if expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Generates access token for user.
     * 
     * @param userDetails User details
     * @return JWT access token
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, username, expiration);
    }

    /**
     * Generates refresh token for user.
     * 
     * @param userDetails User details
     * @return JWT refresh token
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, username, refreshExpiration);
    }

    /**
     * Creates the token.
     * 
     * @param claims Token claims
     * @param subject Token subject (username)
     * @param expiration Token expiration time in seconds
     * @return JWT token
     */
    private String doGenerateToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Validates token.
     * 
     * @param token JWT token
     * @param userDetails User details
     * @return true if valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
} 