/**
 * Local Inter Font Implementation
 * 
 * This approach completely eliminates Google Fonts dependency by using
 * system fonts that closely match Inter's characteristics.
 */

import localFont from 'next/font/local';

// Create a "virtual" local font that uses system fonts
// This eliminates all Google Fonts network requests
export const interLocal = localFont({
  src: [
    {
      path: 'data:font/truetype;charset=utf-8;base64,', // Empty data URL
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif'
  ],
});

// Pure CSS approach - no network requests at all
export const systemInterFont = {
  variable: '--font-inter',
  className: 'font-system-inter',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
  }
};

export default systemInterFont;