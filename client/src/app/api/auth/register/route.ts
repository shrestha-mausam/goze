import { ErrRespDataToFrontend, ErrRespFromBackend, JwtRespFromBackend, RegisterRequest, SuccessRespToFrontend } from '@/lib/types';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const userData = await request.json() as RegisterRequest;

        // Validate required fields
        const { username, firstName, lastName, email, password } = userData;
        const isMissingFields = !username || !firstName || !lastName || !email || !password;
        if (isMissingFields) {
            const errRespDataToClient: ErrRespDataToFrontend = {
                status: StatusCodes.BAD_REQUEST,
                description: 'Missing required fields'
            }
            return NextResponse.json(errRespDataToClient, { status: StatusCodes.BAD_REQUEST });
        }

        const registerUserRequest: RegisterRequest = {
            username,
            firstName,
            lastName,
            email,
            password
        }

        // Call backend directly
        const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(registerUserRequest),
        });
        if (response.ok) { // set the jwt token in the cookies
            const respData = await response.json() as JwtRespFromBackend;
            // get the jwt tokens from the backend server
            const accessToken = respData.data.accessToken;
            const refreshToken = respData.data.refreshToken;
            const successData: SuccessRespToFrontend = {
                success: true,
            }
            const nextjsResp = NextResponse.json(successData, {
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
        console.error('Register API error:', error);
        const errRespDataToClient: ErrRespDataToFrontend = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            description: 'An error occurred during registration',
        }
        return NextResponse.json(errRespDataToClient, {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
}