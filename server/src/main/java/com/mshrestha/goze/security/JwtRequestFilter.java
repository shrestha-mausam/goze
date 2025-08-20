package com.mshrestha.goze.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mshrestha.goze.dto.api.ApiError;
import com.mshrestha.goze.dto.api.ApiResponse;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");
        String jwtToken = null;
        String username = null;

        if(requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
        jwtToken = requestTokenHeader.substring(7);
        try {
            // Validate the token first - this will throw exceptions if invalid
            jwtTokenUtil.validateTokenSignatureAndExpiration(jwtToken);
            
            // Extract username only if token is valid
            username = jwtTokenUtil.getUsernameFromToken(jwtToken);
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "INVALID_SIGNATURE", "JWT signature validation failed");
            return;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "MALFORMED_TOKEN", "JWT token is malformed");
            return;
        } catch (ExpiredJwtException e) {
            logger.error("JWT token has expired", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "EXPIRED_TOKEN", "JWT token has expired");
            return;
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "UNSUPPORTED_TOKEN", "JWT token format is not supported");
            return;
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "INVALID_TOKEN", "JWT token is invalid");
            return;
        } catch (Exception e) {
            logger.error("JWT validation error", e);
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                    "TOKEN_ERROR", "Error processing JWT token");
            return;
        }

        // Once token is validated, set up the security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                logger.error("Authentication error", e);
                sendErrorResponse(response, HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                        "AUTHENTICATION_ERROR", e.getMessage());
                return;
            }
        }
        
        chain.doFilter(request, response);
    }
    
    /**
     * Sends a standardized error response using ApiError and ApiResponse
     */
    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, 
                                  String path, String error, String description) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        ApiError apiError = new ApiError(
            status.value(),
            path,
            error,
            description
        );
        
        ApiResponse<?> apiResponse = ApiResponse.error(apiError);
        
        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
} 