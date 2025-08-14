/**
 * Root Layout Component
 *
 * The main layout component for the Mikhail Ajaj Portfolio application.
 * Provides global providers, metadata, analytics, and accessibility features.
 *
 * @fileoverview Root layout with comprehensive provider setup and SEO optimization
 */

// 1. React Imports
// (None in this component)

// 2. External Libraries
import Script from "next/script";

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { ProductionDataProviders } from "@/lib/contexts/ProductionProviders";
import { ThemeProvider as NextThemesProvider } from "@/app/provider";
import { ErrorProvider, ErrorNotification } from "@/lib/error/ErrorContext";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { ServiceWorkerProvider } from "@/components/ui/ServiceWorkerProvider";
import { errorReporting } from "@/lib/services/errorReporting";
import { errorTracking } from "@/lib/monitoring/ErrorTracking";
import {
  AccessibilityProvider,
  AccessibilityToolbar,
} from "@/components/ui/AccessibilityToolbar";
import WebVitalsReporter from "@/components/performance/WebVitalsReporter";
import { DomainAwareNavigation } from "@/components/ui/navigation/DomainAwareNavigation";
import { MobileBottomNav } from "@/components/ui/navigation/MobileBottomNav";
import { Footer } from "@/components/ui/layout/Footer";

// Font System
import { inter } from "@/lib/fonts/optimized-fonts";

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
import type { Metadata } from "next";

// 6. Stylesheets
import "./globals.css";
// Enhanced accessibility styles now consolidated in globals.css

// Font configuration now handled by the font system

/**
 * Application metadata configuration for SEO and social sharing
 *
 * Includes:
 * - Open Graph tags for social media sharing
 * - Twitter Card configuration
 * - Structured data for search engines
 * - Comprehensive keyword targeting
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://mikhailajaj.github.io"),
  title: "Mikhail Ajaj | Full-Stack, Cloud & Data Engineer",
  description:
    "Portfolio of Mikhail Ajaj, a versatile developer specializing in Full-Stack Development, Cloud Engineering, and Data Solutions.",
  keywords: [
    "Full-Stack Developer",
    "Cloud Engineer",
    "Data Engineer",
    "React",
    "Next.js",
    "AWS",
    "MongoDB",
    "TypeScript",
  ],
  openGraph: {
    title: "Mikhail Ajaj | Full-Stack, Cloud & Data Engineer",
    description:
      "Portfolio of Mikhail Ajaj, a versatile developer specializing in Full-Stack Development, Cloud Engineering, and Data Solutions.",
    url: "https://mikhailajaj.github.io",
    siteName: "Mikhail Ajaj Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://mikhailajaj.github.io/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Mikhail Ajaj Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikhail Ajaj | Full-Stack, Cloud & Data Engineer",
    description:
      "Portfolio of Mikhail Ajaj, a versatile developer specializing in Full-Stack Development, Cloud Engineering, and Data Solutions.",
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
    images: ["https://mikhailajaj.github.io/twitter-image.jpg"], // Replace with your actual Twitter image
  },
};

/**
 * RootLayout Component
 *
 * The root layout component that wraps all pages in the application.
 * Provides essential providers and global functionality.
 *
 * @component
 * @example
 * ```tsx
 * // Automatically applied to all pages in Next.js App Router
 * <RootLayout>
 *   <HomePage />
 * </RootLayout>
 * ```
 *
 * Features:
 * - Theme management with system preference detection
 * - Accessibility toolbar and WCAG compliance
 * - Performance monitoring with Web Vitals
 * - Google Analytics integration
 * - Production-optimized data providers
 * - Hydration mismatch prevention
 *
 * Provider Hierarchy:
 * 1. ProductionDataProviders - Optimized data management
 * 2. AccessibilityProvider - WCAG 2.1 AA compliance
 * 3. ThemeProvider - Dark/light mode with system detection
 *
 * @param props - Component props
 * @param props.children - Page content to render
 * @returns The root layout with all providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize error tracking and reporting services
  if (typeof window !== 'undefined') {
    errorReporting.initialize();
    errorTracking.initialize();
  }
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="M. Ajaj Portfolio" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-PLACEHOLDER"}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-PLACEHOLDER"}');
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.className} bg-white dark:bg-black`}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ProductionDataProviders>
            <ErrorProvider
              reportingEndpoint="/api/error-report"
              announceErrors
              persistErrors
            >
              <AccessibilityProvider>
                <ServiceWorkerProvider>
                    <PerformanceMonitor />
                    <WebVitalsReporter />
                    <AccessibilityToolbar />
                    <ErrorNotification />

                    {/* Main Navigation - Access DomainThemeContext via useContext */}
                    <DomainAwareNavigation />

                    {/* Main Content */}
                    <main className="min-h-screen pt-10">
                      {children}
                    </main>

                    {/* Footer */}
                    <Footer />

                    {/* Mobile Navigation - Access DomainThemeContext via useContext */}
                    <MobileBottomNav />
                </ServiceWorkerProvider>
              </AccessibilityProvider>
            </ErrorProvider>
          </ProductionDataProviders>
        </NextThemesProvider>
      </body>
    </html>
  );
}
