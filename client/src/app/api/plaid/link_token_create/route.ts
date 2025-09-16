import { PlaidLinkTokenResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
const API_PATH = 'plaid/link_token/create';

export async function POST(request: NextRequest) {
    try {
        // Extract cookies from the request
        const cookies = request.cookies.get('accessToken');
        
        if (!cookies) {
            return NextResponse.json(
                { error: 'Access token not found in cookies' },
                { status: 401 }
            );
        }

        // Forward the request to Spring Boot without access token in body
        // Spring Boot will extract the token from cookies
        const response = await fetch(`${BACKEND_API_URL}/${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${cookies.value}` // Forward the cookie
            },
            body: JSON.stringify({}), // Empty body since token comes from cookies
        });

        if (response.ok) {
            const data: PlaidLinkTokenResponse = await response.json();
            console.log('Link token created:', data);
            return NextResponse.json(data);
        } else {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        console.error('Link token creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}