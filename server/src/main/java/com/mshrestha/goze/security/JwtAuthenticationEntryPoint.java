package com.mshrestha.goze.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mshrestha.goze.dto.api.ApiError;
import com.mshrestha.goze.dto.api.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ApiError apiError = new ApiError(
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI(),
            "UNAUTHORIZED",
            authException.getMessage() != null ? authException.getMessage() : "Authentication required"
        );
        
        ApiResponse<?> apiResponse = ApiResponse.error(apiError);
        
        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
} 