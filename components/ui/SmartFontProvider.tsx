/**
 * Smart Font Provider Component
 * 
 * Provides network-aware font loading with graceful fallbacks
 * and eliminates Google Fonts 404 errors through intelligent detection
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSmartFontLoading } from '@/lib/fonts/networkAwareFontLoader';

interface FontContextType {
  fontClassName: string;
  fontStyle?: React.CSSProperties;
  isGoogleFontsAvailable: boolean;
  isLoading: boolean;
}

const FontContext = createContext<FontContextType>({
  fontClassName: 'font-system',
  isGoogleFontsAvailable: false,
  isLoading: true,
});

export function useFont() {
  return useContext(FontContext);
}

interface SmartFontProviderProps {
  children: React.ReactNode;
  fallbackClassName?: string;
}

export function SmartFontProvider({ 
  children, 
  fallbackClassName = 'font-system' 
}: SmartFontProviderProps) {
  const fontConfig = useSmartFontLoading();

  return (
    <FontContext.Provider
      value={{
        fontClassName: fontConfig.className,
        fontStyle: fontConfig.style,
        isGoogleFontsAvailable: fontConfig.shouldUseGoogleFonts,
        isLoading: fontConfig.isLoading,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

/**
 * Font-aware wrapper component
 */
export function FontAwareWrapper({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  const { fontClassName, fontStyle, isLoading } = useFont();

  if (isLoading) {
    // Show with system fonts while loading
    return (
      <div 
        className={`font-system ${className}`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      className={`${fontClassName} ${className}`}
      style={fontStyle}
    >
      {children}
    </div>
  );
}

/**
 * Development font status indicator
 */
export function FontStatusIndicator() {
  const { isGoogleFontsAvailable, isLoading, fontClassName } = useFont();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded z-50 opacity-75">
      <div>Font: {fontClassName}</div>
      <div>Google Fonts: {isLoading ? 'Checking...' : isGoogleFontsAvailable ? '✅' : '❌'}</div>
    </div>
  );
}