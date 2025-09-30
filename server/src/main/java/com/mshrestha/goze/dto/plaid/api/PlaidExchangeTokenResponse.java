package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidExchangeTokenResponse {
    
    @SerializedName("access_token")
    private String accessToken;
    
    @SerializedName("item_id")
    private String itemId;
    
    @SerializedName("request_id")
    private String requestId;

}