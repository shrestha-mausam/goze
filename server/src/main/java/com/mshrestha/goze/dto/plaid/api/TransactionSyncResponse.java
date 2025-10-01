package com.mshrestha.goze.dto.plaid.api;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Plaid's /transactions/sync API.
 * 
 * Plaid Transaction Sync Response Format:
 * {
 *   "added": [
 *     {
 *       "transaction_id": "6J3PmQ9nKdCwGkF8LjHzBnKdqVEWpRfJjMzqj",
 *       "account_id": "BxBXxqh1qr4tM13X7DqnNpgV5m8jEjqPj4Zq5",
 *       "amount": 25.42,
 *       "iso_currency_code": "USD",
 *       "category": ["Food and Drink", "Restaurants"],
 *       "date": "2023-04-10",
 *       "name": "Starbucks",
 *       "merchant_name": "Starbucks Store #12345",
 *       "pending": false,
 *       "transaction_type": "place",
 *       "location": {
 *         "address": "123 Main St",
 *         "city": "San Francisco",
 *         "region": "CA",
 *         "postal_code": "94105",
 *         "country": "US",
 *         "lat": 37.7749,
 *         "lon": -122.4194
 *       }
 *     }
 *   ],
 *   "modified": [...],
 *   "removed": [
 *     {
 *       "transaction_id": "7K4QnR0oLdExHlG9MkIiCoLdqVFXqSgKkNOrrk"
 *     }
 *   ],
 *   "has_more": true,
 *   "next_cursor": "cHVibGljX3Rva2VuX2lkLDE6cHNzcGFjZXJfaWQsNTox"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSyncResponse {
    
    @SerializedName("added")
    private List<Transaction> added;
    
    @SerializedName("modified")
    private List<Transaction> modified;
    
    @SerializedName("removed")
    private List<RemovedTransaction> removed;
    
    @SerializedName("has_more")
    private Boolean hasMore;
    
    @SerializedName("next_cursor")
    private String nextCursor;
    
    @SerializedName("request_id")
    private String requestId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {
        @SerializedName("transaction_id")
        private String transactionId;
        
        @SerializedName("account_id")
        private String accountId;
        
        @SerializedName("amount")
        private Double amount;
        
        @SerializedName("iso_currency_code")
        private String isoCurrencyCode;
        
        @SerializedName("unofficial_currency_code")
        private String unofficialCurrencyCode;
        
        @SerializedName("category")
        private List<String> category;
        
        @SerializedName("check_number")
        private String checkNumber;
        
        @SerializedName("date")
        private String date;
        
        @SerializedName("datetime")
        private String datetime;
        
        @SerializedName("authorized_date")
        private String authorizedDate;
        
        @SerializedName("authorized_datetime")
        private String authorizedDatetime;
        
        @SerializedName("location")
        private Location location;
        
        @SerializedName("merchant_name")
        private String merchantName;
        
        @SerializedName("merchant_entity_id")
        private String merchantEntityId;
        
        @SerializedName("logo_url")
        private String logoUrl;
        
        @SerializedName("website")
        private String website;
        
        @SerializedName("name")
        private String name;
        
        @SerializedName("original_description")
        private String originalDescription;
        
        @SerializedName("payment_meta")
        private PaymentMeta paymentMeta;
        
        @SerializedName("payment_channel")
        private String paymentChannel;
        
        @SerializedName("pending")
        private Boolean pending;
        
        @SerializedName("pending_transaction_id")
        private String pendingTransactionId;
        
        @SerializedName("account_owner")
        private String accountOwner;
        
        @SerializedName("transaction_type")
        private String transactionType;
        
        @SerializedName("personal_finance_category")
        private PersonalFinanceCategory personalFinanceCategory;
        
        @SerializedName("personal_finance_category_icon_url")
        private String personalFinanceCategoryIconUrl;
        
        @SerializedName("counterparties")
        private List<Counterparty> counterparties;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RemovedTransaction {
        @SerializedName("transaction_id")
        private String transactionId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        @SerializedName("address")
        private String address;
        
        @SerializedName("city")
        private String city;
        
        @SerializedName("region")
        private String region;
        
        @SerializedName("postal_code")
        private String postalCode;
        
        @SerializedName("country")
        private String country;
        
        @SerializedName("lat")
        private Double lat;
        
        @SerializedName("lon")
        private Double lon;
        
        @SerializedName("store_number")
        private String storeNumber;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMeta {
        @SerializedName("by_order_of")
        private String byOrderOf;
        
        @SerializedName("payee")
        private String payee;
        
        @SerializedName("payer")
        private String payer;
        
        @SerializedName("payment_method")
        private String paymentMethod;
        
        @SerializedName("payment_processor")
        private String paymentProcessor;
        
        @SerializedName("ppd_id")
        private String ppdId;
        
        @SerializedName("reason")
        private String reason;
        
        @SerializedName("reference_number")
        private String referenceNumber;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalFinanceCategory {
        @SerializedName("primary")
        private String primary;
        
        @SerializedName("detailed")
        private String detailed;
        
        @SerializedName("confidence_level")
        private String confidenceLevel;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Counterparty {
        @SerializedName("name")
        private String name;
        
        @SerializedName("type")
        private String type;
        
        @SerializedName("logo_url")
        private String logoUrl;
        
        @SerializedName("website")
        private String website;
        
        @SerializedName("entity_id")
        private String entityId;
        
        @SerializedName("confidence_level")
        private String confidenceLevel;
        
        @SerializedName("phone_number")
        private String phoneNumber;
    }
}