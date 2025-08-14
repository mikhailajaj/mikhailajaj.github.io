/**
 * Font System Entry Point
 * 
 * Exports all font-related functionality for easy importing
 * throughout the application.
 */

// Core font configuration
export { 
  FONT_CONFIG, 
  INTER_METRICS,
  type FontDefinition,
  type FontConfig,
  type FontMetrics,
  generateFontFamily,
  getFontDisplay,
  shouldPreloadFont
} from './fontConfig';

// Font loading service
export {
  fontLoadingService,
  type FontLoadingState,
  type FontLoadingOptions
} from './fontLoader';

// Enhanced font loader for Next.js
export {
  interFont,
  createFontStrategy,
  getFontPreconnectLinks,
  getFontPrefetchLinks,
  useFontLoading,
  getFontCSSVariables,
  generateFontClasses,
  type FontStrategy
} from './enhancedFontLoader';

// Font monitoring and analytics
export {
  fontMonitoringService,
  type FontMetrics as FontAnalyticsMetrics,
  type FontAnalytics
} from './fontMonitoring';