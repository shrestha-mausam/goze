package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidItemResponse {
    
    @SerializedName("item")
    private PlaidItemData item;
    
    @SerializedName("request_id")
    private String requestId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaidItemData {
        @SerializedName("item_id")
        private String itemId;
        
        @SerializedName("institution_id")
        private String institutionId;
        
        @SerializedName("webhook")
        private String webhook;
        
        @SerializedName("error")
        private PlaidError error;
        
        @SerializedName("available_products")
        private List<String> availableProducts;
        
        @SerializedName("billed_products")
        private List<String> billedProducts;
        
        @SerializedName("products")
        private List<String> products;
        
        @SerializedName("consent_expiration_time")
        private String consentExpirationTime;
        
        @SerializedName("update_type")
        private String updateType;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaidError {
        @SerializedName("error_type")
        private String errorType;
        
        @SerializedName("error_code")
        private String errorCode;
        
        @SerializedName("error_message")
        private String errorMessage;
        
        @SerializedName("display_message")
        private String displayMessage;
        
        @SerializedName("request_id")
        private String requestId;
    }
}