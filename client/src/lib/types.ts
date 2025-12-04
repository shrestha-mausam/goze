/**
 * Plaid Link Token Request to plaid server
 */
// export interface PlaidLinkTokenRequest {
// }
export interface PlaidLinkTokenResponse {
    link_token: string;
    expiration: string;
}

export interface PlaidExchangePublicTokenRequest {
    public_token: string;
}
export interface PlaidExchangePublicTokenResponse {
    access_token: string;
    item_id: string;
}

// =================================================================================
// Backend Spring Boot Server Request and Response Types
// =================================================================================

// Error response from the backend server will look like this// Error codes for the API
export enum ErrorCodeFromBackend {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
}
/**
 * Error Response from Backend
 *
 * Standard error response format from the Spring Boot backend server.
 *
 * @example
 * {
 *   "success": false,
 *   "data": {
 *     "status": 401,
 *     "path": "/api/v1/auth/login",
 *     "error": "Unauthorized",
 *     "description": "Invalid username or password",
 *     "timestamp": "2023-06-15T10:30:45.123Z"
 *   }
 * }
 */
export interface ErrRespFromBackend {
    success: false;
    data: {
        status: number;
        path: string;
        error: string;
        description: string;
        timestamp: string;
    };
}
/**
 * Login Request (/api/v1/auth/login) to backend spring boot server
 *
 * Sent from the client to authenticate a user.
 *
 * @example
 * {
 *   "username": "johndoe",
 *   "password": "securePassword123"
 * }
 */
export interface LoginRequest {
    username: string;
    password: string;
}
/**
 * JWT Token Response from Backend (/api/v1/auth/login)
 *
 * Response containing JWT tokens after successful login or token refresh.
 * This is the format received from the Spring Boot backend.
 *
 * @example
 * {
 *   "success": true,
 *   "data": {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
export interface JwtRespFromBackend {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

/**
 * Registration Request (/api/v1/auth/register) to backend spring boot server
 * Sent from the client to create a new user account.
 *
 * @example
 * {
 *   "username": "johndoe",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john.doe@example.com",
 *   "password": "securePassword123"
 * }
 */
export interface RegisterRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

/**
 * Token Validation Request (/api/v1/auth/validate) to backend spring boot server
 *
 * Sent to validate an existing JWT token.
 *
 * @example
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
export interface ValidateTokenRequest {
    accessToken: string;
}
/**
 * Token Validation Response from Backend
 *
 * Response after validating a token.
 *
 * @example
 * {
 *   "success": true,
 *   "data": {
 *     "expirationDate": "2023-12-31T23:59:59.000Z"
 *   }
 * }
 */
export interface ValidateTokenRespFromBackend {
    success: boolean;
    data: {
        expirationDate: string;
    };
}

/**
 * Token Refresh Request (/api/v1/auth/refresh) to backend spring boot server
 *
 * Sent to get a new access token using a refresh token.
 *
 * @example
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

// ==========================================
// FRONTEND RESPONSE TYPES (API -> Client)
// ==========================================

/**
 * Success Response to Frontend
 *
 * Simplified success response sent from Next.js API routes to the frontend.
 *
 * @example
 * {
 *   "success": true
 * }
 */
export interface SuccessRespToFrontend {
    success: true;
}

/**
 * Error Response Data to Frontend
 *
 * Simplified error response data sent from Next.js API routes to the frontend.
 * This contains only the necessary information for the client.
 *
 * @example
 * {
 *   "status": 401,
 *   "description": "Invalid username or password"
 * }
 */
export interface ErrRespDataToFrontend {
    status: number;
    description: string;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

/**
 * Transaction data from backend
 */
export interface Transaction {
    accountId: string;
    accountName: string;  // NEW: Add this field
    plaidTransactionId: string;
    amount: number;
    date: string;
    name: string;
    merchantName?: string;
    pending: boolean;
    plaidCategory?: string;
    location?: string;
    paymentMeta?: string;
    notes?: string;
    excludedFromBudget: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Account data from backend
 */
export interface Account {
    plaidItemId: string;
    accountId: string;
    name: string;
    mask?: string;
    officialName?: string;
    type: string;
    subtype?: string;
    currentBalance?: number;
    availableBalance?: number;
    currencyCode?: string;
    active: boolean;
    lastUpdated: string;
}

/**
 * Dashboard API responses
 */
export interface GetAllTransactionsResponse {
    success: boolean;
    data: {
        transactions: Transaction[];
        totalCount: number;
    };
}

export interface GetAllAccountsResponse {
    success: boolean;
    data: {
        accounts: Account[];
        totalCount: number;
    };
}

/**
 * Dashboard API requests
 */
export interface GetAllTransactionsRequest {
    // No fields needed - user ID is extracted from JWT token
}

export interface GetAllAccountsRequest {
    // No fields needed - user ID is extracted from JWT token
}

export interface GetExpenseTransactionsRequest {
    // No fields needed - user ID is extracted from JWT token
}

/**
 * Dashboard API responses
 */
export interface GetExpenseTransactionsResponse {
    success: boolean;
    data: {
        transactions: Transaction[];
        totalCount: number;
    };
}
