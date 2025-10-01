package com.mshrestha.goze.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "accounts", schema = "goze")
public class Account {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "plaid_item_id", nullable = false)
    private UUID plaidItemId;
    
    @Column(name = "account_id", nullable = false)
    private String accountId;  // Plaid account ID
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "mask", length = 10)
    private String mask;
    
    @Column(name = "official_name", length = 200)
    private String officialName;
    
    @Column(name = "type", nullable = false, length = 50)
    private String type;
    
    @Column(name = "subtype", length = 50)
    private String subtype;
    
    @Column(name = "current_balance", precision = 19, scale = 4)
    private BigDecimal currentBalance;
    
    @Column(name = "available_balance", precision = 19, scale = 4)
    private BigDecimal availableBalance;
    
    @Column(name = "currency_code", length = 3)
    private String currencyCode = "USD";
    
    @Column(name = "is_active")
    private Boolean active = true;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
    
    // Constructors
    public Account() {}
    
    public Account(UUID userId, UUID plaidItemId, String accountId, String name, String type) {
        this.userId = userId;
        this.plaidItemId = plaidItemId;
        this.accountId = accountId;
        this.name = name;
        this.type = type;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public UUID getPlaidItemId() { return plaidItemId; }
    public void setPlaidItemId(UUID plaidItemId) { this.plaidItemId = plaidItemId; }
    
    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getMask() { return mask; }
    public void setMask(String mask) { this.mask = mask; }
    
    public String getOfficialName() { return officialName; }
    public void setOfficialName(String officialName) { this.officialName = officialName; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getSubtype() { return subtype; }
    public void setSubtype(String subtype) { this.subtype = subtype; }
    
    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }
    
    public BigDecimal getAvailableBalance() { return availableBalance; }
    public void setAvailableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; }
    
    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}