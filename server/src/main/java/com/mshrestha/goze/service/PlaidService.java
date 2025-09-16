package com.mshrestha.goze.service;

import com.mshrestha.goze.dto.plaid.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PlaidService {
    
    @Value("${plaid.client-id}")
    private String clientId;
    
    @Value("${plaid.secret}")
    private String secret;
    
    @Value("${plaid.environment}")
    private String environment;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    private String getBaseUrl() {
        switch (environment.toLowerCase()) {
            case "sandbox":
                return "https://sandbox.plaid.com";
            case "production":
                return "https://production.plaid.com";
            default:
                return "https://sandbox.plaid.com";
        }
    }
    
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("PLAID-CLIENT-ID", clientId);
        headers.set("PLAID-SECRET", secret);
        headers.set("Plaid-Version", "2020-09-14");
        return headers;
    }
    
    public LinkTokenCreateResponse createLinkToken(LinkTokenCreateRequest request) {
        try {
            String url = getBaseUrl() + "/link/token/create";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("client_name", request.getClientName());
            requestBody.put("products", new String[]{"transactions"});
            requestBody.put("country_codes", new String[]{"US"});
            requestBody.put("language", "en");
            
            Map<String, Object> user = new HashMap<>();
            user.put("client_user_id", request.getUserId());
            requestBody.put("user", user);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, createHeaders());
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                return new LinkTokenCreateResponse(
                    (String) responseBody.get("link_token"),
                    (String) responseBody.get("expiration")
                );
            } else {
                throw new RuntimeException("Failed to create link token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create link token: " + e.getMessage(), e);
        }
    }
    
    public ExchangePublicTokenResponse exchangePublicToken(ExchangePublicTokenRequest request) {
        try {
            String url = getBaseUrl() + "/item/public_token/exchange";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("public_token", request.getPublic_token());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, createHeaders());
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                return new ExchangePublicTokenResponse(
                    (String) responseBody.get("access_token"),
                    (String) responseBody.get("item_id"),
                    (String) responseBody.get("request_id")
                );
            } else {
                throw new RuntimeException("Failed to exchange public token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange public token: " + e.getMessage(), e);
        }
    }
}
