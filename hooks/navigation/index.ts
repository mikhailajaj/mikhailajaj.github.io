// Core navigation hook
export { useNavigation } from './useNavigation';
export type { UseNavigationOptions, UseNavigationReturn } from './useNavigation';

// Navigation utilities
export { navigationUtils, navigationItemUtils, domainStylingUtils, responsiveUtils, accessibilityUtils, animationUtils } from './navigationUtils';
export type { NavigationItem, NavigationItemStyleOptions, ResponsiveBreakpoints } from './navigationUtils';

// Performance optimization hooks
export { useThrottledScroll } from './useThrottledScroll';
export type { UseThrottledScrollOptions, UseThrottledScrollReturn } from './useThrottledScroll';

export { useMemoizedNavigation } from './useMemoizedNavigation';
export type { UseMemoizedNavigationOptions, UseMemoizedNavigationReturn } from './useMemoizedNavigation';

export { useKeyboardNavigation } from './useKeyboardNavigation';
export type { UseKeyboardNavigationOptions, UseKeyboardNavigationReturn } from './useKeyboardNavigation';

export { useHydrationSafe, useHydrationSafeNavigation, useHydrationSafeScroll, useHydrationSafeViewport } from './useHydrationSafe';
export type { UseHydrationSafeOptions, UseHydrationSafeReturn } from './useHydrationSafe';

// Navigation context
export { NavigationProvider, useNavigationContext, useNavigationContextSafe, withNavigationContext, useNavigationDebug } from './NavigationContext';
export type { NavigationContextValue, NavigationProviderProps } from './NavigationContext';