package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaidInstitutionRequest {
    
    @SerializedName("institution_id")
    private String institutionId;
    
    @SerializedName("country_codes")
    private String[] countryCodes;
}