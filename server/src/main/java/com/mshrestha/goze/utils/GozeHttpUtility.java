package com.mshrestha.goze.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Utility class for common HTTP-related operations in the Goze application.
 * 
 * This class provides static methods for handling HTTP requests, cookies,
 * and other web-related functionality that can be reused across controllers
 * and filters.
 */
public class GozeHttpUtility {
    
    /**
     * Extracts the access token from HTTP cookies.
     * 
     * This method searches through all cookies in the request to find
     * the cookie named "accessToken" and returns its value.
     * 
     * @param request The HTTP request containing cookies
     * @return The access token if found, null otherwise
     */
    public static String extractAccessTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}