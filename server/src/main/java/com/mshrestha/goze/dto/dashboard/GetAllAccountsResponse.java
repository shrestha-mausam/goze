package com.mshrestha.goze.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllAccountsResponse {
    private List<AccountDto> accounts;
    private int totalCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountDto {
        private UUID plaidItemId;
        private String accountId;           // Plaid account ID
        private String name;
        private String mask;
        private String officialName;
        private String type;
        private String subtype;
        private BigDecimal currentBalance;
        private BigDecimal availableBalance;
        private String currencyCode;
        private Boolean active;
        private String lastUpdated;         // LocalDateTime as string
    }
}