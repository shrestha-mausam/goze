import { NextRequest, NextResponse } from 'next/server';
import { GetExpenseTransactionsRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        console.log('Dashboard expense transactions API route called');
        
        // Parse request body
        const body: GetExpenseTransactionsRequest = await request.json();
        console.log('Request body:', body);

        // Forward request to Spring Boot backend
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        const backendResponse = await fetch(`${backendUrl}/api/v1/dashboard/transactions/get/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
            },
            body: JSON.stringify(body),
        });

        console.log('Backend response status:', backendResponse.status);

        if (!backendResponse.ok) {
            console.error('Backend error:', backendResponse.status, backendResponse.statusText);
            const errorText = await backendResponse.text();
            console.error('Backend error body:', errorText);
            
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Failed to fetch expense transactions',
                    details: errorText 
                },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        console.log('Backend response data:', data);

        // Return the response from backend
        return NextResponse.json(data);

    } catch (error) {
        console.error('Dashboard expense transactions API error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}