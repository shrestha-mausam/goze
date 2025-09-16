package com.mshrestha.goze.dto.plaid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemRequest {
    private String accessToken;
    private String itemId;
    private String userId;
}
