/**
 * Optimized Font Configuration for Next.js 15
 * 
 * This file provides a robust font loading strategy that handles Google Fonts
 * failures gracefully and provides excellent fallbacks.
 */

// Pure system font approach - no Google Fonts dependency
export const inter = {
  variable: '--font-inter',
  className: 'font-inter-system',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
  }
};

// System font configuration (CSS-only approach)
export const systemFontFamily = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'sans-serif'
].join(', ');

// Font class names for easy usage
export const fontClassNames = {
  inter: inter.className,
  variable: inter.variable,
};

// CSS variables for Tailwind integration
export const fontVariables = {
  '--font-inter': inter.style.fontFamily || systemFontFamily,
  '--font-system': systemFontFamily,
} as React.CSSProperties;

export default inter;