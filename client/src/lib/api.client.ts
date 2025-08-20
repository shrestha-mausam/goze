/**
 * Client-side API helpers for making requests to Next.js API routes
 */

import { ErrRespDataToFrontend, LoginRequest, RegisterRequest } from "@/types.server";
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from "next/server";

export async function loginUser(username: string, password: string): Promise<Response> {
  try {
    const loginReqToBackend: LoginRequest = {
      username,
      password,
    }
    return await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginReqToBackend),
    });
  } catch (error) {
    console.error('Login error:', error);
    const errRespDataToClient: ErrRespDataToFrontend = {
      status: 500,
      description: 'Network error occurred',
    }
    return new NextResponse(JSON.stringify(errRespDataToClient), {
      status: 500
    });
  }
}

export async function registerUser(userData: RegisterRequest): Promise<Response> {
  try {
    return await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Register User error:', error);
    return new Response(JSON.stringify({ error: 'Network error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Logs out the current user by removing authentication cookies
 */
export async function logoutUser(): Promise<Response> {
  try {
    return await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
    const errRespDataToClient: ErrRespDataToFrontend = {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      description: 'Error occurred during logout',
    }
    return new NextResponse(JSON.stringify(errRespDataToClient), {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    });
  }
}

// Add other API methods as needed 