// package com.mshrestha.goze;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.jayway.jsonpath.JsonPath;
// import com.mshrestha.goze.dto.auth.*;
// import com.mshrestha.goze.repository.UserRepository;

// import org.junit.jupiter.api.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.transaction.annotation.Transactional;

// import static org.hamcrest.Matchers.is;
// import static org.junit.jupiter.api.Assertions.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// /**
//  * Integration tests for the application.
//  * 
//  * These tests focus on testing multiple components working together,
//  * typically with a real database but in a test environment.
//  */
// @SpringBootTest
// @AutoConfigureMockMvc
// @ActiveProfiles("test")
// @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
// @TestInstance(TestInstance.Lifecycle.PER_CLASS)
// public class IntegrationTests {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @Autowired
//     private UserRepository userRepository;

//     @AfterAll
//     void cleanup() {
//         userRepository.deleteAll();
//     }

//     @Nested
//     @DisplayName("Authentication Flow Integration Tests")
//     @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//     class AuthFlowTests {

//         private String refreshToken;
//         private String accessToken;

//         /**
//          * Tests user registration flow.
//          * 
//          * This test verifies that a user can be successfully registered
//          * and receives JWT tokens.
//          */
//         @Test
//         @Order(1)
//         @DisplayName("Should register a new user successfully")
//         @Transactional
//         void registerUser_withValidData_returnsTokens() throws Exception {
//             // Arrange
//             RegisterRequest registerRequest = new RegisterRequest();
//             registerRequest.setUsername("integration_testuser");
//             registerRequest.setEmail("integration_test@example.com");
//             registerRequest.setPassword("password123");

//             // Act & Assert
//             MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
//                     .contentType(MediaType.APPLICATION_JSON)
//                     .content(objectMapper.writeValueAsString(registerRequest)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.success", is(true)))
//                 .andExpect(jsonPath("$.data.accessToken").exists())
//                 .andExpect(jsonPath("$.data.refreshToken").exists())
//                 .andReturn();

//             // Extract tokens for later tests
//             String responseJson = result.getResponse().getContentAsString();
//             accessToken = JsonPath.read(responseJson, "$.data.accessToken");
//             refreshToken = JsonPath.read(responseJson, "$.data.refreshToken");

//             assertNotNull(accessToken);
//             assertNotNull(refreshToken);
            
//             // Verify user exists in database
//             assertTrue(userRepository.existsByUsername("integration_testuser"));
//         }

//         /**
//          * Tests login flow.
//          * 
//          * This test verifies that a registered user can login
//          * and receive new JWT tokens.
//          */
//         @Test
//         @Order(2)
//         @DisplayName("Should login with registered user credentials")
//         void loginUser_withValidCredentials_returnsTokens() throws Exception {
//             // Arrange
//             LoginRequest loginRequest = new LoginRequest();
//             loginRequest.setUsername("integration_testuser");
//             loginRequest.setPassword("password123");

//             // Act & Assert
//             mockMvc.perform(post("/api/v1/auth/login")
//                     .contentType(MediaType.APPLICATION_JSON)
//                     .content(objectMapper.writeValueAsString(loginRequest)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.success", is(true)))
//                 .andExpect(jsonPath("$.data.accessToken").exists())
//                 .andExpect(jsonPath("$.data.refreshToken").exists());
//         }

//         /**
//          * Tests token validation flow.
//          * 
//          * This test verifies that the access token obtained during registration
//          * can be validated successfully.
//          */
//         @Test
//         @Order(3)
//         @DisplayName("Should validate the access token")
//         void validateToken_withValidAccessToken_returnsSuccess() throws Exception {
//             // Skip if no token from previous test
//             Assumptions.assumeTrue(accessToken != null, "Access token not available");

//             // Arrange
//             ValidateTokenRequest validateRequest = new ValidateTokenRequest();
//             validateRequest.setAccessToken(accessToken);

//             // Act & Assert
//             mockMvc.perform(post("/api/v1/auth/validate")
//                     .contentType(MediaType.APPLICATION_JSON)
//                     .content(objectMapper.writeValueAsString(validateRequest)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.success", is(true)))
//                 .andExpect(jsonPath("$.data.expirationDate").exists());
//         }

//         /**
//          * Tests token refresh flow.
//          * 
//          * This test verifies that the refresh token obtained during registration
//          * can be used to generate new tokens.
//          */
//         @Test
//         @Order(4)
//         @DisplayName("Should refresh tokens successfully")
//         void refreshToken_withValidRefreshToken_returnsNewTokens() throws Exception {
//             // Skip if no token from previous test
//             Assumptions.assumeTrue(refreshToken != null, "Refresh token not available");

//             // Arrange
//             RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
//             refreshRequest.setRefreshToken(refreshToken);

//             // Act & Assert
//             mockMvc.perform(post("/api/v1/auth/refresh")
//                     .contentType(MediaType.APPLICATION_JSON)
//                     .content(objectMapper.writeValueAsString(refreshRequest)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.success", is(true)))
//                 .andExpect(jsonPath("$.data.accessToken").exists())
//                 .andExpect(jsonPath("$.data.refreshToken").exists());
//         }
//     }
// } 