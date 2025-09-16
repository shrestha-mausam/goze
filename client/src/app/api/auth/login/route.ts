import { NextRequest, NextResponse } from 'next/server';
import { ErrRespDataToFrontend, ErrRespFromBackend, JwtRespFromBackend, SuccessRespToFrontend, LoginRequest } from '@/lib/types';
import { StatusCodes } from 'http-status-codes';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api/v1';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { username, password }: LoginRequest = body;
        const isMissingFields = !username || !password;
        if (isMissingFields) {
            const errRespDataToClient: ErrRespDataToFrontend = {
                status: StatusCodes.BAD_REQUEST,
                description: 'Missing required fields',
            }
            return NextResponse.json(errRespDataToClient, { status: StatusCodes.BAD_REQUEST });
        }
        // Call backend directly
        const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) { // set the jwt token in the cookies
            const responseData = await response.json() as JwtRespFromBackend;
            // get the jwt tokens from the backend server
            const accessToken = responseData.data.accessToken;
            const refreshToken = responseData.data.refreshToken;
            const successRespToClient: SuccessRespToFrontend = {
                success: true,
            }
            const nextjsResp = NextResponse.json(successRespToClient, {
                status: StatusCodes.OK,
            });
            // set the jwt tokens in the cookies
            nextjsResp.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
            nextjsResp.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
            return nextjsResp;
        } else { // give back error code and description 
            const errRespData = await response.json() as ErrRespFromBackend;
            // filter out info from backend error response and include only necessary data in the frontend error response 
            const errRespDataToClient: ErrRespDataToFrontend = {
                status: errRespData.data.status,
                description: errRespData.data.description,
            }
            return NextResponse.json(errRespDataToClient, {
                status: errRespData.data.status,
            });
        }
    } catch (error) {
        console.error('Login API error:', error);
        const errRespDataToClient: ErrRespDataToFrontend = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            description: 'An error occurred during login',
        }
        return NextResponse.json(errRespDataToClient, {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
} 