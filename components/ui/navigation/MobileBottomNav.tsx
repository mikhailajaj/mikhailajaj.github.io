"use client";

// 1. React Imports
import React, { useState, useEffect } from "react";

// 2. External Libraries
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBlog,
  FaEnvelope,
  FaTrophy,
  FaCode,
} from "react-icons/fa";

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from "@/lib/utils/cn";
import { useSafePathname, useIsHydrated } from "@/lib/utils/hydration";
import { useDomainTheme } from "@/lib/contexts/DomainThemeContext";
// import { useNavigationThemeMigration } from "@/lib/theme/migration/MenuMigrationBridge"; // Removed during cleanup
import { announceUtils } from "@/lib/utils/accessibility";
import { mobileNavigationItems } from "@/data/navigation";

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

interface MobileBottomNavProps {
  className?: string;
  /** ARIA label for the navigation */
  ariaLabel?: string;
}

// Convert centralized navigation data to mobile format
const navItems: NavItem[] = mobileNavigationItems.map(item => ({
  icon: React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" }),
  label: item.name,
  href: item.href,
  badge: undefined, // Can be added later if needed
}));

export function MobileBottomNav({ 
  className, 
  ariaLabel = "Mobile bottom navigation" 
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { isActiveLink } = useSafePathname(pathname);
  const isHydrated = useIsHydrated() ?? false; // Safe fallback
  
  // Always call hooks consistently to avoid hook order violations
  // const themeBridge = useNavigationThemeMigration(); // Removed during cleanup
  const { currentDomainColor } = useDomainTheme();
  
  // Always get the styles, but use fallbacks during SSR
  // const navBarStyles = themeBridge.navigationTheme.getNavBarStyles(); // Removed during cleanup
  const navBarStyles = {}; // Fallback to default styles
  const accentColor = currentDomainColor; // Use domain context color directly
  
  // Create hydration-safe style objects
  const getContainerStyles = () => {
    if (!isHydrated) {
      return {
        backgroundColor: 'var(--background)',
        borderTopColor: 'var(--border)',
        color: 'var(--foreground)',
      };
    }
    return {
      backgroundColor: `${navBarStyles.backgroundColor}f0`, // 95% opacity
      borderTopColor: navBarStyles.borderColor,
      color: navBarStyles.color,
    };
  };
  
  const getLinkStyles = (isActive: boolean) => {
    if (!isHydrated) {
      return {
        color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
        backgroundColor: isActive ? 'var(--primary)' : 'transparent',
        opacity: isActive ? 1 : 0.7,
      };
    }
    return {
      color: isActive ? 'var(--primary-foreground, #ffffff)' : navBarStyles.color,
      backgroundColor: isActive ? `${accentColor}80` : 'transparent',
      opacity: isActive ? 1 : 0.7,
      focusRingColor: accentColor,
    };
  };
  
  const getAccentColor = () => isHydrated ? accentColor : 'var(--primary)';
  const getDomainColor = () => isHydrated ? currentDomainColor : 'var(--primary)';

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "backdrop-blur-md",
        "border-t",
        "safe-area-pb", // For devices with home indicator
        className,
      )}
      style={getContainerStyles()}
    >
      <nav 
        className="grid grid-cols-5 h-16"
        role="navigation"
        aria-label={ariaLabel}
      >
        {navItems.map((item, index) => {
          const isActive = isActiveLink(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              role="tab"
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.label}${isActive ? ' (current page)' : ''}`}
              onClick={() => {
                announceUtils.announce(`Navigated to ${item.label}`, 'polite');
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-2 py-2",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "min-h-[48px] min-w-[48px]", // Touch target size
              )}
              style={getLinkStyles(isActive)}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 w-8 h-1 rounded-full"
                  style={{ 
                    x: "-50%",
                    backgroundColor: getAccentColor(),
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  aria-hidden="true"
                />
              )}

              {/* Icon with animation */}
              <motion.div
                className="relative"
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-hidden="true"
              >
                {item.icon}

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getDomainColor() }}
                    aria-label={`${item.badge} notifications`}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "opacity-100 scale-100" : "opacity-70 scale-95",
                )}
              >
                {item.label}
              </span>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: isHydrated && currentDomainColor ? `${currentDomainColor}10` : 'var(--muted)' }}
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Hook to add bottom padding to content when mobile nav is visible
export function useMobileBottomNavPadding() {
  return "pb-16 md:pb-0"; // 64px (h-16) padding bottom on mobile
}
