import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { public_token } = body;

        if (!public_token) {
            return NextResponse.json(
                { error: 'publicToken is required' },
                { status: 400 }
            );
        }

        // Extract cookies from the request
        const cookies = request.cookies.get('accessToken');
        
        if (!cookies) {
            return NextResponse.json(
                { error: 'Access token not found in cookies' },
                { status: 401 }
            );
        }

        // Forward the request to Spring Boot with only public_token in body
        // Spring Boot will extract accessToken from cookies
        const response = await fetch(`${BACKEND_API_URL}/plaid/public_token/exchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${cookies.value}` // Forward the cookie
            },
            body: JSON.stringify({ public_token }),
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        console.error('Exchange public token error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}