import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  
  // Optimized content paths for better performance
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    // Exclude unnecessary paths for better performance
    "!./node_modules/**/*",
    "!./.next/**/*",
  ],
  
  // Next.js built-in optimizations
  experimental: {
    optimizeUniversalDefaults: true,
  },
  
  theme: {
    // Use Next.js container queries
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    
    extend: {
      // CSS Custom Properties for dynamic theming
      colors: {
        // Domain-aware color system using CSS variables
        domain: {
          primary: "hsl(var(--domain-primary))",
          secondary: "hsl(var(--domain-secondary))",
          accent: "hsl(var(--domain-accent))",
        },
        
        // Semantic color system
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      
      // Typography system with fluid scaling
      fontSize: {
        // Fluid typography using clamp()
        "fluid-xs": "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)",
        "fluid-base": "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1rem + 0.625vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 1.3rem + 1vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)",
        "fluid-4xl": "clamp(2.25rem, 1.9rem + 1.75vw, 3rem)",
        "fluid-5xl": "clamp(3rem, 2.5rem + 2.5vw, 4rem)",
      },
      
      // Spacing system with logical properties
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      
      // Animation system optimized for performance
      keyframes: {
        // GPU-accelerated animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Domain-specific animations
        "domain-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 hsl(var(--domain-primary) / 0.7)" 
          },
          "70%": { 
            boxShadow: "0 0 0 10px hsl(var(--domain-primary) / 0)" 
          },
        },
      },
      
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "domain-pulse": "domain-pulse 2s infinite",
      },
      
      // Grid system for layout
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(250px, 1fr))",
        "auto-fill": "repeat(auto-fill, minmax(200px, 1fr))",
      },
      
      // Backdrop blur for glassmorphism
      backdropBlur: {
        xs: "2px",
      },
      
      // Border radius system
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  
  plugins: [
    require("tailwindcss-animate"),
    
    // Custom plugin for component classes
    function({ addComponents, theme }) {
      addComponents({
        // Layout components
        ".container-fluid": {
          width: "100%",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4"),
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "100%",
        },
        
        // Navigation components
        ".nav-link": {
          display: "flex",
          alignItems: "center",
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          borderRadius: theme("borderRadius.md"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
          },
        },
        
        // Card components
        ".card": {
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          borderRadius: theme("borderRadius.lg"),
          border: "1px solid hsl(var(--border))",
          boxShadow: theme("boxShadow.sm"),
        },
        
        // Button variants
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme("borderRadius.md"),
          fontSize: theme("fontSize.sm"),
          fontWeight: theme("fontWeight.medium"),
          transition: "all 0.2s ease-in-out",
          "&:focus-visible": {
            outline: "2px solid hsl(var(--ring))",
            outlineOffset: "2px",
          },
        },
        
        ".btn-primary": {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          "&:hover": {
            backgroundColor: "hsl(var(--primary) / 0.9)",
          },
        },
        
        ".btn-secondary": {
          backgroundColor: "hsl(var(--secondary))",
          color: "hsl(var(--secondary-foreground))",
          "&:hover": {
            backgroundColor: "hsl(var(--secondary) / 0.8)",
          },
        },
        
        // Domain-aware components
        ".domain-card": {
          backgroundColor: "hsl(var(--card))",
          borderRadius: theme("borderRadius.xl"),
          padding: theme("spacing.6"),
          border: "1px solid hsl(var(--domain-primary) / 0.2)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "hsl(var(--domain-primary))",
            boxShadow: `0 10px 25px hsl(var(--domain-primary) / 0.15)`,
            transform: "translateY(-2px)",
          },
        },
        
        // Accessibility helpers
        ".sr-only": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: "0",
        },
        
        // Focus styles
        ".focus-ring": {
          "&:focus-visible": {
            outline: "2px solid hsl(var(--ring))",
            outlineOffset: "2px",
          },
        },
      });
    },
    
    // Plugin for CSS custom properties
    function({ addBase }) {
      addBase({
        ":root": {
          // Default light theme
          "--background": "0 0% 100%",
          "--foreground": "222.2 84% 4.9%",
          "--card": "0 0% 100%",
          "--card-foreground": "222.2 84% 4.9%",
          "--popover": "0 0% 100%",
          "--popover-foreground": "222.2 84% 4.9%",
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--secondary": "210 40% 96%",
          "--secondary-foreground": "222.2 84% 4.9%",
          "--muted": "210 40% 96%",
          "--muted-foreground": "215.4 16.3% 46.9%",
          "--accent": "210 40% 96%",
          "--accent-foreground": "222.2 84% 4.9%",
          "--destructive": "0 84.2% 60.2%",
          "--destructive-foreground": "210 40% 98%",
          "--border": "214.3 31.8% 91.4%",
          "--input": "214.3 31.8% 91.4%",
          "--ring": "221.2 83.2% 53.3%",
          
          // Domain colors (default to full-stack)
          "--domain-primary": "221.2 83.2% 53.3%",
          "--domain-secondary": "197 71% 52%",
          "--domain-accent": "221.2 83.2% 45%",
        },
        
        ".dark": {
          // Dark theme
          "--background": "222.2 84% 4.9%",
          "--foreground": "210 40% 98%",
          "--card": "222.2 84% 4.9%",
          "--card-foreground": "210 40% 98%",
          "--popover": "222.2 84% 4.9%",
          "--popover-foreground": "210 40% 98%",
          "--primary": "217.2 91.2% 59.8%",
          "--primary-foreground": "222.2 84% 4.9%",
          "--secondary": "217.2 32.6% 17.5%",
          "--secondary-foreground": "210 40% 98%",
          "--muted": "217.2 32.6% 17.5%",
          "--muted-foreground": "215 20.2% 65.1%",
          "--accent": "217.2 32.6% 17.5%",
          "--accent-foreground": "210 40% 98%",
          "--destructive": "0 62.8% 30.6%",
          "--destructive-foreground": "210 40% 98%",
          "--border": "217.2 32.6% 17.5%",
          "--input": "217.2 32.6% 17.5%",
          "--ring": "224.3 76.3% 94.1%",
        },
      });
    },
  ],
} satisfies Config;

export default config;