package com.mshrestha.goze.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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
        private UUID accountId;
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