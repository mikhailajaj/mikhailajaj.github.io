"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import ThemeSwitcher from "../ThemeSwitcher";

interface NavItem {
  name: string;
  link: string;
  icon?: React.JSX.Element;
  dropdown?: {
    name: string;
    link: string;
  }[];
}

interface EnhancedFloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

export const EnhancedFloatingNav: React.FC<EnhancedFloatingNavProps> = ({
  navItems,
  className,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setActiveDropdown(null);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const isActiveLink = (link: string) => {
    if (link.startsWith('#')) {
      return false; // Hash links are handled differently
    }
    if (link === '/services' && pathname.startsWith('/services')) {
      return true;
    }
    return pathname === link;
  };

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -100 
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-white/[0.2] dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-8 py-4 items-center justify-center space-x-4 z-[100]",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <div key={`nav-${idx}`} className="relative">
          {navItem.dropdown ? (
            // Dropdown menu item
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle(navItem.name)}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-all duration-200 px-3 py-2 rounded-full",
                  isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                )}
              >
                <span className="text-sm font-medium">{navItem.name}</span>
                <FaChevronDown 
                  className={cn(
                    "text-xs transition-transform duration-200",
                    activeDropdown === navItem.name && "rotate-180"
                  )} 
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === navItem.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50"
                  >
                    {navItem.dropdown.map((dropdownItem, dropdownIdx) => (
                      <Link
                        key={`dropdown-${dropdownIdx}`}
                        href={dropdownItem.link}
                        onClick={() => setActiveDropdown(null)}
                        className={cn(
                          "block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                          isActiveLink(dropdownItem.link) && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Regular nav item
            <Link
              href={navItem.link}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-all duration-200 px-3 py-2 rounded-full",
                isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
              )}
            >
              {navItem.icon && <span className="block sm:hidden">{navItem.icon}</span>}
              <span className="text-sm font-medium">{navItem.name}</span>
            </Link>
          )}
        </div>
      ))}
      
      {/* Theme Switcher */}
      <div className="border-l border-gray-300 dark:border-gray-600 pl-4 ml-4">
        <ThemeSwitcher />
      </div>
    </motion.div>
  );
};