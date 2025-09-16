package com.mshrestha.goze.dto.plaid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkTokenCreateRequest {
    private String userId;
    private String clientName;
    private String[] products;
    private String[] countryCodes;
    private String language;
    private String webhook;
    private String redirectUri;
    
    // Constructor for required fields only
    public LinkTokenCreateRequest(String userId, String clientName) {
        this.userId = userId;
        this.clientName = clientName;
        this.products = new String[]{"transactions"};
        this.countryCodes = new String[]{"US"};
        this.language = "en";
    }
}