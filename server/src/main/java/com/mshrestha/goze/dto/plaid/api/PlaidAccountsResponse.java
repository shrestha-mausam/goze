package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidAccountsResponse {
    
    @SerializedName("accounts")
    private List<PlaidAccount> accounts;
    
    @SerializedName("request_id")
    private String requestId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaidAccount {
        @SerializedName("account_id")
        private String accountId;
        
        @SerializedName("name")
        private String name;
        
        @SerializedName("mask")
        private String mask;
        
        @SerializedName("official_name")
        private String officialName;
        
        @SerializedName("type")
        private String type;
        
        @SerializedName("subtype")
        private String subtype;
        
        @SerializedName("balances")
        private Balances balances;
        
        @SerializedName("verification_status")
        private String verificationStatus;
        
        @SerializedName("persistent_account_id")
        private String persistentAccountId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Balances {
        @SerializedName("available")
        private Double available;
        
        @SerializedName("current")
        private Double current;
        
        @SerializedName("iso_currency_code")
        private String isoCurrencyCode;
        
        @SerializedName("unofficial_currency_code")
        private String unofficialCurrencyCode;
        
        @SerializedName("limit")
        private Double limit;
    }
}