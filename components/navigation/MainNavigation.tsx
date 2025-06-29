"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaBars, FaTimes, FaHome, FaUser, FaCog, FaBlog, FaEnvelope } from "react-icons/fa";
import ThemeSwitcher from "../ThemeSwitcher";

interface NavItem {
  name: string;
  link: string;
  icon?: React.JSX.Element;
  dropdown?: {
    name: string;
    link: string;
    description?: string;
  }[];
}

interface MainNavigationProps {
  navItems: NavItem[];
  className?: string;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  navItems,
  className,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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
    if (link === '/blog' && pathname.startsWith('/blog')) {
      return true;
    }
    return pathname === link;
  };

  const getNavIcon = (name: string) => {
    const iconMap: Record<string, React.JSX.Element> = {
      'About': <FaUser className="w-4 h-4" />,
      'Skills': <FaCog className="w-4 h-4" />,
      'Projects': <FaHome className="w-4 h-4" />,
      'Blog': <FaBlog className="w-4 h-4" />,
      'Contact': <FaEnvelope className="w-4 h-4" />,
    };
    return iconMap[name] || <FaHome className="w-4 h-4" />;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        ref={dropdownRef}
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -100 
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Mikhail Ajaj
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((navItem, idx) => (
                <div key={`nav-${idx}`} className="relative">
                  {navItem.dropdown ? (
                    // Dropdown menu item
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(navItem.name)}
                        className={cn(
                          "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                          isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        <span>{navItem.name}</span>
                        <FaChevronDown 
                          className={cn(
                            "w-3 h-3 transition-transform duration-200",
                            activeDropdown === navItem.name && "rotate-180"
                          )} 
                        />
                      </button>

                      {/* Enhanced Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === navItem.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50"
                          >
                            {navItem.dropdown.map((dropdownItem, dropdownIdx) => (
                              <Link
                                key={`dropdown-${dropdownIdx}`}
                                href={dropdownItem.link}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  "block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group",
                                  isActiveLink(dropdownItem.link) && "bg-blue-50 dark:bg-blue-900/20"
                                )}
                              >
                                <div className="flex flex-col">
                                  <span className={cn(
                                    "font-medium",
                                    isActiveLink(dropdownItem.link) 
                                      ? "text-blue-600 dark:text-blue-400" 
                                      : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                  )}>
                                    {dropdownItem.name}
                                  </span>
                                  {dropdownItem.description && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {dropdownItem.description}
                                    </span>
                                  )}
                                </div>
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
                        "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <span>{navItem.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-5 h-5" />
                ) : (
                  <FaBars className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MA</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    Mikhail Ajaj
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu items */}
              <div className="flex-1 overflow-y-auto py-4">
                {navItems.map((navItem, idx) => (
                  <div key={`mobile-nav-${idx}`} className="px-4 mb-2">
                    {navItem.dropdown ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(`mobile-${navItem.name}`)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                            "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                            isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            {getNavIcon(navItem.name)}
                            <span className="font-medium">{navItem.name}</span>
                          </div>
                          <FaChevronDown 
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              activeDropdown === `mobile-${navItem.name}` && "rotate-180"
                            )} 
                          />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === `mobile-${navItem.name}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-2 ml-4 space-y-1"
                            >
                              {navItem.dropdown.map((dropdownItem, dropdownIdx) => (
                                <Link
                                  key={`mobile-dropdown-${dropdownIdx}`}
                                  href={dropdownItem.link}
                                  className={cn(
                                    "block p-3 rounded-lg text-sm transition-colors",
                                    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                                    isActiveLink(dropdownItem.link) && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  )}
                                >
                                  <div className="font-medium">{dropdownItem.name}</div>
                                  {dropdownItem.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {dropdownItem.description}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={navItem.link}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                          "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                          isActiveLink(navItem.link) && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {getNavIcon(navItem.name)}
                        <span className="font-medium">{navItem.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile menu footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  © 2024 Mikhail Ajaj
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};