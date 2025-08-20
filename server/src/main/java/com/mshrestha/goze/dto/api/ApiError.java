package com.mshrestha.goze.dto.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private int status;
    private String path;
    private String error;
    private String description;
    private String timestamp;
    
    public ApiError(int status, String path, String error, String description) {
        this.status = status;
        this.path = path;
        this.error = error;
        this.description = description;
        this.timestamp = Instant.now().toString();
    }
} 