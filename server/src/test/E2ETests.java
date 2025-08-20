// package com.mshrestha.goze;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.mshrestha.goze.dto.api.ApiResponse;
// import com.mshrestha.goze.dto.auth.*;

// import org.junit.jupiter.api.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.web.client.TestRestTemplate;
// import org.springframework.http.*;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.context.DynamicPropertyRegistry;
// import org.springframework.test.context.DynamicPropertySource;
// import org.testcontainers.containers.PostgreSQLContainer;
// import org.testcontainers.junit.jupiter.Container;
// import org.testcontainers.junit.jupiter.Testcontainers;

// import java.util.Map;

// import static org.junit.jupiter.api.Assertions.*;

// /**
//  * End-to-End tests for the application.
//  * 
//  * These tests focus on testing the complete application flow
//  * with all real dependencies or containerized equivalents.
//  */
// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// @Testcontainers
// @ActiveProfiles("test")
// @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
// @TestInstance(TestInstance.Lifecycle.PER_CLASS)
// public class E2ETests {

//     @Container
//     static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
//         .withDatabaseName("testdb")
//         .withUsername("test")
//         .withPassword("test");
        
//     @DynamicPropertySource
//     static void postgresProperties(DynamicPropertyRegistry registry) {
//         registry.add("spring.datasource.url", postgres::getJdbcUrl);
//         registry.add("spring.datasource.username", postgres::getUsername);
//         registry.add("spring.datasource.password", postgres::getPassword);
//     }

//     @Autowired
//     private TestRestTemplate restTemplate;

//     @Autowired
//     private ObjectMapper objectMapper;

//     private String accessToken;
//     private String refreshToken;

//     @Nested
//     @DisplayName("Authentication E2E Flow")
//     @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//     class AuthE2ETests {

//         /**
//          * Tests complete user registration flow.
//          * 
//          * This test verifies that a user can be successfully registered
//          * through the public API.
//          */
//         @Test
//         @Order(1)
//         @DisplayName("Should register a new user through API")
//         void registerUser_throughAPI_succeeds() {
//             // Arrange
//             RegisterRequest registerRequest = new RegisterRequest();
//             registerRequest.setUsername("e2e_testuser");
//             registerRequest.setEmail("e2e_test@example.com");
//             registerRequest.setPassword("password123");

//             // Act
//             ResponseEntity<ApiResponse> response = restTemplate.exchange(
//                 "/api/v1/auth/register",
//                 HttpMethod.POST,
//                 new HttpEntity<>(registerRequest, createJsonHeaders()),
//                 ApiResponse.class
//             );

//             // Assert
//             assertEquals(HttpStatus.OK, response.getStatusCode());
//             assertTrue(response.getBody().isSuccess());
            
//             // Extract tokens for later tests
//             Map<String, String> data = (Map<String, String>) response.getBody().getData();
//             accessToken = data.get("accessToken");
//             refreshToken = data.get("refreshToken");

//             assertNotNull(accessToken);
//             assertNotNull(refreshToken);
//         }

//         /**
//          * Tests the login flow through the API.
//          * 
//          * This test verifies that a registered user can login through
//          * the public API.
//          */
//         @Test
//         @Order(2)
//         @DisplayName("Should login with registered user through API")
//         void loginUser_throughAPI_succeeds() {
//             // Arrange
//             LoginRequest loginRequest = new LoginRequest();
//             loginRequest.setUsername("e2e_testuser");
//             loginRequest.setPassword("password123");

//             // Act
//             ResponseEntity<ApiResponse> response = restTemplate.exchange(
//                 "/api/v1/auth/login",
//                 HttpMethod.POST,
//                 new HttpEntity<>(loginRequest, createJsonHeaders()),
//                 ApiResponse.class
//             );

//             // Assert
//             assertEquals(HttpStatus.OK, response.getStatusCode());
//             assertTrue(response.getBody().isSuccess());
//             assertNotNull(((Map<String, String>) response.getBody().getData()).get("accessToken"));
//         }

//         /**
//          * Tests token validation through the API.
//          * 
//          * This test verifies that the access token can be validated through
//          * the public API.
//          */
//         @Test
//         @Order(3)
//         @DisplayName("Should validate the token through API")
//         void validateToken_throughAPI_succeeds() {
//             // Skip if no token from previous test
//             Assumptions.assumeTrue(accessToken != null, "Access token not available");

//             // Arrange
//             ValidateTokenRequest validateRequest = new ValidateTokenRequest();
//             validateRequest.setAccessToken(accessToken);

//             // Act
//             ResponseEntity<ApiResponse> response = restTemplate.exchange(
//                 "/api/v1/auth/validate",
//                 HttpMethod.POST,
//                 new HttpEntity<>(validateRequest, createJsonHeaders()),
//                 ApiResponse.class
//             );

//             // Assert
//             assertEquals(HttpStatus.OK, response.getStatusCode());
//             assertTrue(response.getBody().isSuccess());
//             assertNotNull(((Map<String, String>) response.getBody().getData()).get("expirationDate"));
//         }

//         /**
//          * Tests token refresh through the API.
//          * 
//          * This test verifies that the refresh token can be used to
//          * obtain new tokens through the public API.
//          */
//         @Test
//         @Order(4)
//         @DisplayName("Should refresh the token through API")
//         void refreshToken_throughAPI_succeeds() {
//             // Skip if no token from previous test
//             Assumptions.assumeTrue(refreshToken != null, "Refresh token not available");

//             // Arrange
//             RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
//             refreshRequest.setRefreshToken(refreshToken);

//             // Act
//             ResponseEntity<ApiResponse> response = restTemplate.exchange(
//                 "/api/v1/auth/refresh",
//                 HttpMethod.POST,
//                 new HttpEntity<>(refreshRequest, createJsonHeaders()),
//                 ApiResponse.class
//             );

//             // Assert
//             assertEquals(HttpStatus.OK, response.getStatusCode());
//             assertTrue(response.getBody().isSuccess());
            
//             // Update tokens
//             Map<String, String> data = (Map<String, String>) response.getBody().getData();
//             assertNotNull(data.get("accessToken"));
//             assertNotNull(data.get("refreshToken"));
            
//             // Update tokens for next tests
//             accessToken = data.get("accessToken");
//             refreshToken = data.get("refreshToken");
//         }

//         /**
//          * Tests accessing a protected resource with the token.
//          * 
//          * This test verifies that the access token can be used to access
//          * protected resources.
//          */
//         @Test
//         @Order(5)
//         @DisplayName("Should access protected resource with token")
//         void accessProtectedResource_withToken_succeeds() {
//             // Skip if no token from previous test
//             Assumptions.assumeTrue(accessToken != null, "Access token not available");

//             // Arrange
//             HttpHeaders headers = createJsonHeaders();
//             headers.setBearerAuth(accessToken);

//             // Act
//             ResponseEntity<ApiResponse> response = restTemplate.exchange(
//                 "/api/v1/users/profile",  // Example protected endpoint
//                 HttpMethod.GET,
//                 new HttpEntity<>(headers),
//                 ApiResponse.class
//             );

//             // Assert
//             assertEquals(HttpStatus.OK, response.getStatusCode());
//             assertTrue(response.getBody().isSuccess());
//         }
//     }

//     @Nested
//     @DisplayName("User Management E2E Tests")
//     class UserManagementE2ETests {
//         // Tests for user management through API
//     }

//     @Nested
//     @DisplayName("Content Access E2E Tests")
//     class ContentAccessE2ETests {
//         // Tests for content access through API
//     }

//     /**
//      * Creates HTTP headers for JSON content.
//      */
//     private HttpHeaders createJsonHeaders() {
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         return headers;
//     }
// } 