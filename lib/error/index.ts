/**
 * Error Handling Utilities
 * 
 * Centralized exports for all error handling utilities.
 * 
 * @fileoverview Error handling utilities index
 */

// Error Context
export {
  ErrorProvider,
  ErrorNotification,
  useError,
  type AppError,
  type ErrorSeverity,
  type ErrorSource,
} from './ErrorContext';

// Error Boundary
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from './ErrorBoundary';

// API Error Utilities
export {
  ApiError,
  ApiErrorCode,
  ApiErrorStatus,
  ApiErrorMessage,
  createSuccessResponse,
  createErrorResponse,
  handleApiRoute,
  withErrorHandling,
  type ApiResponse,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from './api-error';

// Error Handler Hook
export {
  useErrorHandler,
} from './useErrorHandler';

// Re-export commonly used types
export type {
  ErrorBoundaryProps,
} from './ErrorBoundary';