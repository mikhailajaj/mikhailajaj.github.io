'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Domain } from '@/data/schemas/project';
import { Button } from '@/components/ui/base/Button';
import { cn } from '@/lib/utils/cn';
import { 
  FaCode, 
  FaCloud, 
  FaChartBar, 
  FaPalette, 
  FaLightbulb,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaGraduationCap,
  FaTrophy,
  FaBlog,
  FaEnvelope
} from 'react-icons/fa';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  domain?: Domain;
  description?: string;
}

interface DomainAwareNavigationProps {
  currentDomain?: Domain;
  className?: string;
}

const domainConfig = {
  'full-stack': {
    name: 'Full-Stack',
    icon: <FaCode />,
    color: 'from-slate-600 to-slate-800',
    description: 'End-to-end web development'
  },
  'cloud': {
    name: 'Cloud Engineering',
    icon: <FaCloud />,
    color: 'from-blue-600 to-blue-800',
    description: 'AWS & DevOps solutions'
  },
  'data': {
    name: 'Data Analytics',
    icon: <FaChartBar />,
    color: 'from-green-600 to-green-800',
    description: 'ML & Business Intelligence'
  },
  'ux-ui': {
    name: 'UX/UI Design',
    icon: <FaPalette />,
    color: 'from-purple-600 to-purple-800',
    description: 'User experience & interface design'
  },
  'consulting': {
    name: 'Technical Consulting',
    icon: <FaLightbulb />,
    color: 'from-orange-600 to-orange-800',
    description: 'Strategic technology guidance'
  },
};

const mainNavItems: NavigationItem[] = [
  { name: 'Home', href: '/', icon: <FaHome /> },
  { name: 'Experience', href: '/experience', icon: <FaUser /> },
  { name: 'Education', href: '/education', icon: <FaGraduationCap /> },
  { name: 'Achievements', href: '/achievements', icon: <FaTrophy /> },
  { name: 'Blog', href: '/blog', icon: <FaBlog /> },
  { name: 'Contact', href: '/contact', icon: <FaEnvelope /> },
];

const domainNavItems: NavigationItem[] = [
  { name: 'Full-Stack', href: '/full-stack', icon: <FaCode />, domain: 'full-stack' },
  { name: 'Cloud Engineering', href: '/cloud-engineering', icon: <FaCloud />, domain: 'cloud' },
  { name: 'Data Analytics', href: '/data-analytics', icon: <FaChartBar />, domain: 'data' },
  { name: 'UX/UI Design', href: '/ux-ui-design', icon: <FaPalette />, domain: 'ux-ui' },
  { name: 'Technical Consulting', href: '/technical-consulting', icon: <FaLightbulb />, domain: 'consulting' },
];

export function DomainAwareNavigation({ currentDomain, className }: DomainAwareNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDomainConfig = currentDomain ? domainConfig[currentDomain] : null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Current Domain */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="text-white font-semibold text-lg">Mikhail Ajaj</span>
            </Link>
            
            {currentDomainConfig && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className={cn(
                  'w-2 h-2 rounded-full bg-gradient-to-r',
                  currentDomainConfig.color
                )} />
                <span className="text-white text-sm font-medium">
                  {currentDomainConfig.name}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Main Navigation */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                )}
              >
                <span className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}

            {/* Domain Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                Expertise
              </button>
              
              <div className="absolute top-full left-0 mt-1 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  {domainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                        pathname === item.href
                          ? 'bg-white/20 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r',
                        item.domain ? domainConfig[item.domain].color : 'from-gray-600 to-gray-800'
                      )}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.domain && (
                          <div className="text-xs text-gray-400">
                            {domainConfig[item.domain].description}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Main Navigation */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Domain Navigation */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider px-3 py-2">
                  Expertise Areas
                </div>
                {domainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                      pathname === item.href
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <span className={cn(
                      'w-6 h-6 rounded flex items-center justify-center bg-gradient-to-r text-xs',
                      item.domain ? domainConfig[item.domain].color : 'from-gray-600 to-gray-800'
                    )}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}