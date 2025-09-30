package com.mshrestha.goze.dto.dashboard;

import lombok.Data;

@Data
public class GetAllAccountsRequest {
    // No fields needed - user ID is extracted from JWT token
    // This prevents users from accessing other users' accounts
}