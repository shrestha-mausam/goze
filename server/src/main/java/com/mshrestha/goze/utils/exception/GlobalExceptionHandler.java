package com.mshrestha.goze.utils.exception;

import com.mshrestha.goze.dto.api.ApiError;
import com.mshrestha.goze.dto.api.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleBadCredentialsException(
            BadCredentialsException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "INVALID_CREDENTIALS",
            "Invalid username or password"
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }
    
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleDisabledException(
            DisabledException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "ACCOUNT_DISABLED",
            "Your account is disabled"
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleUsernameNotFoundException(
            UsernameNotFoundException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "USER_NOT_FOUND",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }
    
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleAccountLockedException(
            AccountLockedException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "ACCOUNT_LOCKED",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }
    
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleRateLimitExceededException(
            RateLimitExceededException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.TOO_MANY_REQUESTS.value(),
            request.getRequestURI(),
            "RATE_LIMIT_EXCEEDED",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(error));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ApiError>> handleGlobalException(
            Exception ex, 
            HttpServletRequest request) {
        
        logger.error("An unexpected error occurred", ex);
        
        ApiError error = new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            request.getRequestURI(),
            "INTERNAL_SERVER_ERROR",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleNoHandlerFoundException(
            NoHandlerFoundException ex, 
            HttpServletRequest request) {
        
        logger.warn("No handler found for {} {}", ex.getHttpMethod(), ex.getRequestURL());
        
        ApiError error = new ApiError(
            HttpStatus.NOT_FOUND.value(),
            request.getRequestURI(),
            "ENDPOINT_NOT_FOUND",
            "The requested endpoint does not exist"
        );
        
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleDuplicateResourceException(
            DuplicateResourceException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.CONFLICT.value(),
            request.getRequestURI(),
            "RESOURCE_ALREADY_EXISTS",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleInvalidTokenException(
            InvalidTokenException ex, 
            HttpServletRequest request) {
        
        ApiError error = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "INVALID_TOKEN",
            ex.getMessage()
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<ApiError>> handleNoResourceFoundException(
            NoResourceFoundException ex, 
            HttpServletRequest request) {
        
        logger.warn("No resource found for {}", request.getRequestURI());
        
        ApiError error = new ApiError(
            HttpStatus.NOT_FOUND.value(),
            request.getRequestURI(),
            "RESOURCE_NOT_FOUND",
            "The requested resource does not exist"
        );
        
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error));
    }

} 