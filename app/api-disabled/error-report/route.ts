/**
 * Error Reporting API Route
 * 
 * API route for client-side error reporting.
 * 
 * @fileoverview Error reporting API route
 */

// Configure route for dynamic behavior
// Dynamic flags disabled for static export compatibility

import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ApiErrorCode, createSuccessResponse } from '@/lib/error/api-error';

/**
 * Error report interface
 */
interface ErrorReport {
  message: string;
  source: string;
  componentName?: string;
  severity: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  context?: Record<string, any>;
}

/**
 * Validate error report
 */
function validateErrorReport(data: any): ErrorReport {
  if (!data) {
    throw new ApiError(ApiErrorCode.BAD_REQUEST, 'Missing request body');
  }
  
  if (!data.message) {
    throw new ApiError(ApiErrorCode.BAD_REQUEST, 'Missing error message');
  }
  
  if (!data.source) {
    throw new ApiError(ApiErrorCode.BAD_REQUEST, 'Missing error source');
  }
  
  if (!data.severity) {
    throw new ApiError(ApiErrorCode.BAD_REQUEST, 'Missing error severity');
  }
  
  return data as ErrorReport;
}

/**
 * Store error report
 */
async function storeErrorReport(report: ErrorReport): Promise<void> {
  // In a real application, you would store the error report in a database
  // For this example, we'll just log it to the console
  console.log('Error report received:', report);
  
  // Simulate async storage
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * POST handler for error reporting
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const data = await request.json();
    
    // Validate error report
    const report = validateErrorReport(data);
    
    // Add IP address if available
    const reportWithIp = {
      ...report,
      ip: request.ip || 'unknown',
    };
    
    // Store error report
    await storeErrorReport(reportWithIp);
    
    // Return success response
    return NextResponse.json(
      createSuccessResponse({ received: true }),
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.status });
    }
    
    // Handle unknown errors
    const apiError = new ApiError(
      ApiErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to process error report'
    );
    
    return NextResponse.json(apiError.toResponse(), { status: apiError.status });
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}