package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidLinkTokenRequest {
    
    @SerializedName("client_name")
    private String clientName;
    
    @SerializedName("products")
    private List<String> products;
    
    @SerializedName("country_codes")
    private List<String> countryCodes;
    
    @SerializedName("language")
    private String language;
    
    @SerializedName("user")
    private PlaidUser user;
    
    @SerializedName("webhook")
    private String webhook;
    
    @SerializedName("redirect_uri")
    private String redirectUri;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaidUser {
        @SerializedName("client_user_id")
        private String clientUserId;
    }
}