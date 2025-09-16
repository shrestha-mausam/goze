/**
 * Client-side API helpers for making requests to Next.js API routes
 */

import { ErrRespDataToFrontend, LoginRequest, PlaidExchangePublicTokenRequest, RegisterRequest } from "@/lib/types";
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

/**
 * Creates a Plaid link token for bank account linking
 */
export async function createPlaidLinkToken(): Promise<Response> {
    try {
        return await fetch('/api/plaid/link_token_create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({}),
        });
    } catch (error) {
        console.error('Create Plaid link token error:', error);
        const errRespDataToClient: ErrRespDataToFrontend = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            description: 'Error occurred while creating link token',
        }
        return new NextResponse(JSON.stringify(errRespDataToClient), {
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}

/**
 * Exchanges a Plaid public token for an access token
 */
export async function exchangePlaidPublicToken(publicToken: string): Promise<Response> {
    try {
        const requestBody: PlaidExchangePublicTokenRequest = {
            public_token: publicToken,
        };

        return await fetch('/api/plaid/exchange_public_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
        });
    } catch (error) {
        console.error('Exchange Plaid public token error:', error);
        const errRespDataToClient: ErrRespDataToFrontend = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            description: 'Error occurred while exchanging public token',
        }
        return new NextResponse(JSON.stringify(errRespDataToClient), {
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}


