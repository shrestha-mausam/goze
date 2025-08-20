package com.mshrestha.goze.utils;

import java.security.SecureRandom;
import java.util.Base64;

public class KeyGenerator {
    
    public static void main(String[] args) {
        // Generate a 512-bit (64-byte) key
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[64];
        secureRandom.nextBytes(key);
        
        // Convert to Base64 for easier handling
        String encodedKey = Base64.getEncoder().encodeToString(key);
        
        System.out.println("Generated JWT Secret Key:");
        System.out.println(encodedKey);
    }
} 