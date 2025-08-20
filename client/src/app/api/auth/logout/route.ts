import { ErrRespDataToFrontend, SuccessRespToFrontend } from '@/types.server';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Handles user logout by removing authentication cookies
 * 
 * This endpoint:
 * 1. Removes the accessToken cookie
 * 2. Removes the refreshToken cookie
 * 3. Returns a success response
 * 
 * No backend call is needed since we're just removing client-side cookies
 */
export async function POST() {
  try {
    // Get the cookies store
    const cookieStore = cookies();
    
    // Delete the authentication cookies
    (await cookieStore).delete('accessToken');
    (await cookieStore).delete('refreshToken');
    
    // Create success response
    const successResponse: SuccessRespToFrontend = {
      success: true
    };
    
    // Return success response
    return NextResponse.json(successResponse, {
      status: StatusCodes.OK
    });
  } catch (error) {
    console.error('Logout error:', error);
    const errRespDataToClient: ErrRespDataToFrontend = {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      description: 'An error occurred during logout',
    }
    return NextResponse.json(errRespDataToClient, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
