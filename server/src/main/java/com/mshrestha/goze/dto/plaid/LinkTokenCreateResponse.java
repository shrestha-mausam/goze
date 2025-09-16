package com.mshrestha.goze.dto.plaid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkTokenCreateResponse {
    private String link_token;
    private String expiration;
}