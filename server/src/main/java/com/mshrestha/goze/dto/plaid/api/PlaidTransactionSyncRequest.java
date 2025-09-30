package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidTransactionSyncRequest {
    
    @SerializedName("access_token")
    private String accessToken;
    
    @SerializedName("cursor")
    private String cursor;
    
    @SerializedName("count")
    private Integer count;
}