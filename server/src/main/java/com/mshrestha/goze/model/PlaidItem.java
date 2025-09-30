package com.mshrestha.goze.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plaid_items", schema = "goze")
public class PlaidItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "item_id", nullable = false)
    private String itemId;
    
    @Column(name = "access_token", nullable = false)
    private String accessToken;
    
    @Column(name = "institution_id")
    private String institutionId;
    
    @Column(name = "institution_name")
    private String institutionName;
    
    @Column(name = "is_active")
    private boolean active = true;
    
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
}