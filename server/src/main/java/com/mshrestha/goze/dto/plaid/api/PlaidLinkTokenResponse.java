package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidLinkTokenResponse {
    
    @SerializedName("link_token")
    private String linkToken;
    
    @SerializedName("expiration")
    private String expiration;
    
    @SerializedName("request_id")
    private String requestId;
}