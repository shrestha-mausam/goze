import { LoginRequest, RegisterRequest, ValidateTokenRequest } from "@/types.server";
/**
 * Authentication service for handling login, registration, and token management
 * THIS SERVICE SHOULD ONLY BE USED SERVER-SIDE IN API ROUTES
 */
const authService = {
  /**
   * Login a user with username and password
   */
  login: async (username: string, password: string): Promise<Response> => {
    try {
      const request: LoginRequest = {
        username,
        password,
      };
      
      // api call to the backend server
      const response = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      return response;
    } catch (error) {
      console.error('Login service error:', error);
      return Response.error();
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<Response> => {
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return response;
    } catch (error) {
      console.error('Registration service error:', error);
      return Response.error();
    }
  },
  
  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Additional cleanup if needed
  },
  
  /**
   * Get the current authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Validate an authentication token
   */
  validateToken: async (accessToken: string): Promise<Response> => {
    try {
      const request: ValidateTokenRequest = {
        accessToken: accessToken,
      };
      
      const response = await fetch(`${process.env.BACKEND_API_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (error) {
      console.error('Token validation service error:', error);
      return Response.error();
    }
  }
};

export default authService;
