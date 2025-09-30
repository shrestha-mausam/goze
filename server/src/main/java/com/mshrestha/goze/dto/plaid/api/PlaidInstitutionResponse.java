package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidInstitutionResponse {
    
    @SerializedName("institution")
    private PlaidInstitutionData institution;
    
    @SerializedName("request_id")
    private String requestId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaidInstitutionData {
        @SerializedName("institution_id")
        private String institutionId;
        
        @SerializedName("name")
        private String name;
        
        @SerializedName("products")
        private List<String> products;
        
        @SerializedName("country_codes")
        private List<String> countryCodes;
        
        @SerializedName("url")
        private String url;
        
        @SerializedName("primary_color")
        private String primaryColor;
        
        @SerializedName("logo")
        private String logo;
        
        @SerializedName("routing_numbers")
        private List<String> routingNumbers;
    }
}