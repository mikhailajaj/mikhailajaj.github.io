/** Provider.tsx */
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme="system" // Uses system theme by default
      attribute="class" // Adds theme class to the body element
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
