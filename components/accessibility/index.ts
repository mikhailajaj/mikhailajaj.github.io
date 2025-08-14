/**
 * Universal Accessibility System
 * 
 * Entry point for the consolidated accessibility system that replaces:
 * - components/ui/sally-accessibility-framework.tsx
 * - components/ui/sally-cognitive-optimizer.tsx
 * 
 * This system provides:
 * ✅ WCAG 2.1 AA compliance
 * ✅ Cognitive load optimization  
 * ✅ Adaptive user interfaces
 * ✅ Performance monitoring
 * ✅ Screen reader support
 * ✅ Keyboard navigation
 * ✅ High contrast mode
 * ✅ Font size adjustment
 * ✅ Progressive disclosure
 * ✅ Lazy loading with metrics
 */

export { UniversalAccessibilitySystem } from "./UniversalAccessibilitySystem";
export * from "./UniversalAccessibilitySystem";

// Make it the default export for easy importing
export { UniversalAccessibilitySystem as default } from "./UniversalAccessibilitySystem";