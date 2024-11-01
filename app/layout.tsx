import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import ThemeSwitcher from "@/components/ThemeSwitcher"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mikhai Ajaj's portfolio",
  description: "overview of my work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className +  "bg-white dark:bg-black"}>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
