package com.mshrestha.goze.dto.dashboard;

import lombok.Data;

/**
 * Request DTO for getting expense transactions.
 * No fields needed - user ID is extracted from JWT token for security.
 */
@Data
public class GetExpenseTransactionsRequest {
    // No fields needed - user ID is extracted from JWT token
    // This prevents users from accessing other users' transactions
}