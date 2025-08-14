/**
 * API Error Utilities
 * 
 * Utilities for handling API errors in a consistent way.
 * 
 * @fileoverview API error handling utilities
 */

/**
 * API error codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
}

/**
 * API error status codes
 */
export const ApiErrorStatus: Record<ApiErrorCode, number> = {
  [ApiErrorCode.BAD_REQUEST]: 400,
  [ApiErrorCode.UNAUTHORIZED]: 401,
  [ApiErrorCode.FORBIDDEN]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.METHOD_NOT_ALLOWED]: 405,
  [ApiErrorCode.CONFLICT]: 409,
  [ApiErrorCode.UNPROCESSABLE_ENTITY]: 422,
  [ApiErrorCode.TOO_MANY_REQUESTS]: 429,
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ApiErrorCode.SERVICE_UNAVAILABLE]: 503,
  [ApiErrorCode.GATEWAY_TIMEOUT]: 504,
};

/**
 * API error messages
 */
export const ApiErrorMessage: Record<ApiErrorCode, string> = {
  [ApiErrorCode.BAD_REQUEST]: 'Bad request',
  [ApiErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ApiErrorCode.FORBIDDEN]: 'Forbidden',
  [ApiErrorCode.NOT_FOUND]: 'Not found',
  [ApiErrorCode.METHOD_NOT_ALLOWED]: 'Method not allowed',
  [ApiErrorCode.CONFLICT]: 'Conflict',
  [ApiErrorCode.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [ApiErrorCode.TOO_MANY_REQUESTS]: 'Too many requests',
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ApiErrorCode.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [ApiErrorCode.GATEWAY_TIMEOUT]: 'Gateway timeout',
};

/**
 * API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: any;
  };
  status: number;
}

/**
 * API success response interface
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  status: number;
}

/**
 * API response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API Error class
 */
export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: any;

  constructor(code: ApiErrorCode, message?: string, details?: any) {
    super(message || ApiErrorMessage[code]);
    this.name = 'ApiError';
    this.code = code;
    this.status = ApiErrorStatus[code];
    this.details = details;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Convert to API error response
   */
  toResponse(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
      status: this.status,
    };
  }

  /**
   * Create API error from unknown error
   */
  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    
    const message = error instanceof Error ? error.message : String(error);
    return new ApiError(ApiErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}

/**
 * Create API success response
 */
export function createSuccessResponse<T>(data: T, status = 200): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    status,
  };
}

/**
 * Create API error response
 */
export function createErrorResponse(
  code: ApiErrorCode,
  message?: string,
  details?: any
): ApiErrorResponse {
  return new ApiError(code, message, details).toResponse();
}

/**
 * Handle API route errors
 */
export async function handleApiRoute<T>(
  handler: () => Promise<T>,
  errorHandler?: (error: unknown) => ApiErrorResponse
): Promise<ApiResponse<T>> {
  try {
    const data = await handler();
    return createSuccessResponse(data);
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error);
    }
    
    return ApiError.fromError(error).toResponse();
  }
}

/**
 * API route wrapper
 */
export function withErrorHandling<T>(
  handler: () => Promise<T>,
  errorHandler?: (error: unknown) => ApiErrorResponse
) {
  return async () => {
    return handleApiRoute(handler, errorHandler);
  };
}