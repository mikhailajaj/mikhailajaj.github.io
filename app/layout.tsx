import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Script from "next/script";
import WebVitalsReporter from "@/components/performance/WebVitalsReporter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mikhailajaj.github.io'),
  title: "Mikhail Ajaj | Full-Stack, Cloud & Data Engineer",
  description: "Portfolio of Mikhail Ajaj, a versatile developer specializing in Full-Stack Development, Cloud Engineering, and Data Solutions.",
  keywords: ["Full-Stack Developer", "Cloud Engineer", "Data Engineer", "React", "Next.js", "AWS", "MongoDB", "TypeScript"],
  openGraph: {
    title: "Mikhail Ajaj | Full-Stack, Cloud & Data Engineer",
    description: "Portfolio of Mikhail Ajaj, a versatile developer specializing in Full-Stack Development, Cloud Engineering, and Data Solutions.",
    url: "https://mikhailajaj.github.io",
    siteName: "Mikhail Ajaj Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER'}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER'}');
            `,
          }}
        />
      </head>
      <body className={inter.className + " bg-white dark:bg-black"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WebVitalsReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
