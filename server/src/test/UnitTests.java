package com.mshrestha.goze;

import com.mshrestha.goze.controller.AuthController;
import com.mshrestha.goze.dto.api.ApiResponse;
import com.mshrestha.goze.dto.auth.*;
import com.mshrestha.goze.model.User;
import com.mshrestha.goze.repository.UserRepository;
import com.mshrestha.goze.security.JwtTokenUtil;
import com.mshrestha.goze.security.JwtUserDetailsService;
import com.mshrestha.goze.service.AuthService;
import com.mshrestha.goze.utils.exception.InvalidTokenException;
import com.mshrestha.goze.utils.exception.RateLimitExceededException;
import jakarta.servlet.http.HttpServletRequest;
import com.mshrestha.goze.utils.exception.DuplicateResourceException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;

import javax.security.auth.login.AccountLockedException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the application.
 * 
 * These tests focus on testing individual components in isolation,
 * with all dependencies mocked.
 */
@ExtendWith(MockitoExtension.class)
public class UnitTests {

    @Nested
    @DisplayName("Auth Service Tests")
    class AuthServiceTests {

        @Mock
        private JwtTokenUtil jwtTokenUtil;

        @Mock
        private UserRepository userRepository;

        @Mock
        private JwtUserDetailsService userDetailsService;

        @Mock
        private PasswordEncoder passwordEncoder;

        @Mock
        private AuthenticationManager authenticationManager;

        @InjectMocks
        private AuthService authService;

        @Test
        @DisplayName("Should raise exception when rate limit is exceeded")
        void rateLimitExceededExceptionTest() {
            String ipAddress = "127.0.0.1";

            assertThrows(RateLimitExceededException.class, () -> {
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
            });
        }

        @Test
        @DisplayName("Should not raise exception when within rate limit")
        void rateLimitNotExceededTest() {
            String ipAddress = "127.0.0.1";

            // Should not throw any exception
            assertDoesNotThrow(() -> {
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
                authService.checkRateLimit(ipAddress);
            });
        }

        @Test
        @DisplayName("Should raise exception when username already exists")
        void loginUserSuccessTest() {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("testuser");
            loginRequest.setPassword("password123");

            User user = new User();
            user.setUsername("testuser");
            user.setPassword("encoded_password");
            
            when(authenticationManager.authenticate(any())).thenReturn(null);
            doNothing().when(userDetailsService).updateLastLogin(anyString());
            when(jwtTokenUtil.generateToken(anyString())).thenReturn("access.token");
            when(jwtTokenUtil.generateRefreshToken(anyString())).thenReturn("refresh.token");
            
            JwtTokenResponse response = authService.loginUser(loginRequest);
            
            assertNotNull(response);
            assertEquals("access.token", response.getAccessToken());
            assertEquals("refresh.token", response.getRefreshToken());
        }

        /**
         * Tests login failure due to invalid credentials.
         * 
         * This test verifies that the service properly handles authentication failures
         * and increments failed login attempts.
         */
        @Test
        @DisplayName("Should handle login failure due to invalid credentials")
        void loginUserInvalidCredentialsTest() {
            // Arrange
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("testuser");
            loginRequest.setPassword("wrongpassword");
            
            when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid credentials"));
            
            // Act & Assert
            assertThrows(BadCredentialsException.class, () -> {
                authService.loginUser(loginRequest);
            });
            
            // Verify failed login attempts were incremented
            verify(userDetailsService).incrementFailedLoginAttempts("testuser");
        }
        
        /**
         * Tests login failure due to disabled user account.
         * 
         * This test verifies that the service properly handles authentication
         * for disabled accounts.
         */
        @Test
        @DisplayName("Should handle login failure due to disabled account")
        void loginUserDisabledAccountTest() {
            // Arrange
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("disableduser");
            loginRequest.setPassword("password123");
            
            when(authenticationManager.authenticate(any()))
                .thenThrow(new DisabledException("User account is disabled"));
            
            // Act & Assert
            assertThrows(DisabledException.class, () -> {
                authService.loginUser(loginRequest);
            });
            
            // Verify failed login attempts were not incremented for disabled accounts
            verify(userDetailsService, never()).incrementFailedLoginAttempts(anyString());
        }
        
        /**
         * Tests login failure due to account being locked.
         * 
         * This test verifies that the service properly handles authentication
         * for locked accounts.
         */
        @Test
        @DisplayName("Should handle login failure due to locked account")
        void loginUserLockedAccountTest() {
            // Arrange
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("lockeduser");
            loginRequest.setPassword("password123");
            
            when(userDetailsService.loadUserByUsername("lockeduser"))
                .thenThrow(new AccountLockedException("Account is temporarily locked"));
            
            when(authenticationManager.authenticate(any()))
                .thenAnswer(invocation -> {
                    throw new AccountLockedException("Account is temporarily locked");
                });
            
            // Act & Assert
            assertThrows(AccountLockedException.class, () -> {
                authService.loginUser(loginRequest);
            });
        }
        
        /**
         * Tests login failure due to user not found.
         * 
         * This test verifies that the service properly handles authentication
         * for non-existent users.
         */
        @Test
        @DisplayName("Should handle login failure due to user not found")
        void loginUserNotFoundTest() {
            // Arrange
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("nonexistentuser");
            loginRequest.setPassword("password123");
            
            when(authenticationManager.authenticate(any()))
                .thenThrow(new UsernameNotFoundException("User not found"));
            
            // Act & Assert
            assertThrows(UsernameNotFoundException.class, () -> {
                authService.loginUser(loginRequest);
            });
        }

        /**
         * Tests user registration with new credentials.
         * 
         * This test verifies that the service properly creates a new user
         * and returns JWT tokens.
         */
        @Test
        @DisplayName("Should register new user successfully")
        void registerUserSuccessTest() {
            // Arrange
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setFirstName("New");
            registerRequest.setLastName("User");
            registerRequest.setUsername("newuser");
            registerRequest.setEmail("newuser@example.com");
            registerRequest.setPassword("password123");
            
            User savedUser = new User();
            savedUser.setUsername("newuser");
            savedUser.setEmail("newuser@example.com");
            
            when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(jwtTokenUtil.generateToken(savedUser.getUsername())).thenReturn("access.token");
            when(jwtTokenUtil.generateRefreshToken(savedUser.getUsername())).thenReturn("refresh.token");
            
            // Act
            JwtTokenResponse response = authService.registerUser(registerRequest);
            
            // Assert
            assertNotNull(response);
            assertEquals("access.token", response.getAccessToken());
            assertEquals("refresh.token", response.getRefreshToken());
            verify(userRepository).save(any(User.class));
        }

        /**
         * Tests token refresh.
         * 
         * This test verifies that the service correctly refreshes tokens.
         */
        @Test
        @DisplayName("Should refresh token successfully")
        void refreshTokenSuccessTest() {
            // Arrange
            String refreshToken = "valid.refresh.token";
            String username = "testuser";
            
            RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
            refreshRequest.setRefreshToken(refreshToken);
            
            UserDetails userDetails = mock(UserDetails.class);
            
            when(jwtTokenUtil.getUsernameFromToken(refreshToken)).thenReturn(username);
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(jwtTokenUtil.validateToken(refreshToken, userDetails)).thenReturn(true);
            when(jwtTokenUtil.generateToken(username)).thenReturn("new.access.token");
            when(jwtTokenUtil.generateRefreshToken(username)).thenReturn("new.refresh.token");
            
            // Act
            JwtTokenResponse response = authService.refreshToken(refreshRequest.getRefreshToken());
            
            // Assert
            assertNotNull(response);
            assertEquals("new.access.token", response.getAccessToken());
            assertEquals("new.refresh.token", response.getRefreshToken());
            verify(userDetailsService).loadUserByUsername(username);
            verify(jwtTokenUtil).validateToken(refreshToken, userDetails);
        }
        
        
        // /**
        //  * Tests token validation.
        //  * 
        //  * This test verifies that the service correctly validates JWT tokens.
        //  */
        // @Test
        // @DisplayName("Should validate token successfully")
        // void validateTokenSuccessTest() {
        //     // Arrange
        //     String token = "valid.token";

        //     when(jwtTokenUtil.validateTokenSignatureAndExpiration(token)).doNothing();
        //     when(authService.getTokenExpirationDate(token)).thenReturn(new Date());
        //     // Act
        //     boolean isValid = authService.validateToken(token);
            
        //     // Assert
        //     assertTrue(isValid);
        //     verify(jwtTokenUtil).validateToken(token);
        // }
        
        // /**
        //  * Tests token refresh.
        //  * 
        //  * This test verifies that the service correctly refreshes tokens.
        //  */
        // @Test
        // @DisplayName("Should refresh token successfully")
        // void refreshTokenSuccessTest() {
        //     // Arrange
        //     String refreshToken = "valid.refresh.token";
        //     User user = new User();
            
        //     when(jwtTokenUtil.validateToken(refreshToken)).thenReturn(true);
        //     when(jwtTokenUtil.getUserIdFromToken(refreshToken)).thenReturn("user_id");
        //     when(userRepository.findById("user_id")).thenReturn(java.util.Optional.of(user));
        //     when(jwtTokenUtil.generateToken(user)).thenReturn("new.access.token");
        //     when(jwtTokenUtil.generateRefreshToken(user)).thenReturn("new.refresh.token");
            
        //     // Act
        //     JwtTokenResponse response = authService.refreshToken(refreshToken);
            
        //     // Assert
        //     assertNotNull(response);
        //     assertEquals("new.access.token", response.getAccessToken());
        //     assertEquals("new.refresh.token", response.getRefreshToken());
        // }
    }
    
    // Other unit tests for different components
} 