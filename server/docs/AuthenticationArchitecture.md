# Authentication System Architecture

## Overview

The authentication system provides secure user authentication using JWT (JSON Web Tokens) with the following features:
- Username/email and password authentication
- JWT token generation and validation
- Token refresh mechanism
- Account locking after failed attempts
- Rate limiting to prevent brute force attacks

## Components

1. **Controllers**
   - `AuthController`: Handles authentication endpoints (login, register, refresh token)

2. **Services**
   - `AuthService`: Contains business logic for authentication
   - `JwtUserDetailsService`: Loads user details from the database

3. **Security**
   - `JwtTokenUtil`: Generates and validates JWT tokens
   - `JwtRequestFilter`: Intercepts requests to validate JWT tokens
   - `SecurityConfig`: Configures security settings and endpoints

4. **Models**
   - `User`: Entity representing user data

5. **Repositories**
   - `UserRepository`: Data access for user information

6. **Utilities**
   - Exception handling
   - API response formatting

## Authentication Flow

1. **Login Process**:
   - Client sends credentials to `/api/v1/auth/login`
   - System validates credentials
   - If valid, generates access and refresh tokens
   - Returns tokens to client

2. **Protected Resource Access**:
   - Client includes JWT token in Authorization header
   - `JwtRequestFilter` validates token
   - If valid, request proceeds to controller
   - If invalid/expired, returns 401 Unauthorized

3. **Token Refresh**:
   - Client sends refresh token to `/api/v1/auth/refresh`
   - System validates refresh token
   - If valid, generates new access token
   - Returns new token to client

## Security Features

1. **Password Security**:
   - Passwords stored as BCrypt hashes
   - Never transmitted or stored in plain text

2. **Account Protection**:
   - Account locked after 5 failed login attempts
   - 30-minute lockout period

3. **Rate Limiting**:
   - 5 login attempts per minute per IP address
   - Prevents brute force attacks

4. **Token Security**:
   - Short-lived access tokens (1 hour)
   - Longer-lived refresh tokens (24 hours)
   - HMAC-SHA512 signature algorithm 