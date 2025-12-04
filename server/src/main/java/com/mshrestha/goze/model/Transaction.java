package com.mshrestha.goze.model;

import com.mshrestha.goze.utils.JsonbType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions", schema = "goze")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "account_id", nullable = false)
    private String accountId;
    
    @Column(name = "plaid_transaction_id", unique = true)
    private String plaidTransactionId;
    
    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;
    
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "merchant_name", length = 255)
    private String merchantName;
    
    @Column(name = "pending")
    private Boolean pending = false;


    @Column(name = "plaid_category", length = 255)
    private String plaidCategory;
    
    @Type(JsonbType.class)
    @Column(name = "location", columnDefinition = "JSONB")
    private String location;
    
    @Type(JsonbType.class)
    @Column(name = "payment_meta", columnDefinition = "JSONB")
    private String paymentMeta;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "excluded_from_budget")
    private Boolean excludedFromBudget = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(UUID userId, String accountId, String plaidTransactionId, 
                      BigDecimal amount, LocalDate date, String name) {
        this.userId = userId;
        this.accountId = accountId;
        this.plaidTransactionId = plaidTransactionId;
        this.amount = amount;
        this.date = date;
        this.name = name;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public String getAccountId() {
        return accountId;
    }
    
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
    
    public String getPlaidTransactionId() {
        return plaidTransactionId;
    }
    
    public void setPlaidTransactionId(String plaidTransactionId) {
        this.plaidTransactionId = plaidTransactionId;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getMerchantName() {
        return merchantName;
    }
    
    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }
    
    public Boolean getPending() {
        return pending;
    }
    
    public void setPending(Boolean pending) {
        this.pending = pending;
    }
    
    public String getPlaidCategory() {
        return plaidCategory;
    }
    
    public void setPlaidCategory(String plaidCategory) {
        this.plaidCategory = plaidCategory;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getPaymentMeta() {
        return paymentMeta;
    }
    
    public void setPaymentMeta(String paymentMeta) {
        this.paymentMeta = paymentMeta;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Boolean getExcludedFromBudget() {
        return excludedFromBudget;
    }
    
    public void setExcludedFromBudget(Boolean excludedFromBudget) {
        this.excludedFromBudget = excludedFromBudget;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}