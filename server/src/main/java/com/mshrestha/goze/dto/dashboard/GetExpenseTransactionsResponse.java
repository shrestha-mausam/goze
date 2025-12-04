package com.mshrestha.goze.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for getting expense transactions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetExpenseTransactionsResponse {
    private List<TransactionDto> transactions;
    private int totalCount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionDto {
        private String accountId;
        private String accountName;        // NEW: Add for display
        private String plaidTransactionId;
        private BigDecimal amount;
        private String date;              // LocalDate as string
        private String name;
        private String merchantName;
        private Boolean pending;
        private String plaidCategory;     // Primary category from personal finance category
        private String location;
        private String paymentMeta;
        private String notes;
        private Boolean excludedFromBudget;
        private String createdAt;         // LocalDateTime as string
        private String updatedAt;         // LocalDateTime as string
    }
}