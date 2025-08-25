'use client';

/**
 * Social Share Buttons Component
 * 
 * Provides social media sharing functionality for the testimonials page
 * with support for multiple platforms and custom messaging.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/lib/motion-utils';
import { cn } from '@/lib/utils';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

interface SharePlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  getShareUrl: (url: string, title: string, description: string) => string;
  ariaLabel: string;
}

/**
 * Social sharing platforms configuration
 */
const sharePlatforms: SharePlatform[] = [
  {
    name: 'LinkedIn',
    ariaLabel: 'Share on LinkedIn',
    color: 'hover:bg-blue-600 hover:text-white',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    getShareUrl: (url, title, description) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
  },
  {
    name: 'Twitter',
    ariaLabel: 'Share on Twitter',
    color: 'hover:bg-black hover:text-white',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getShareUrl: (url, title, description) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} - ${description}`)}&via=mikhailajaj`
  },
  {
    name: 'Facebook',
    ariaLabel: 'Share on Facebook',
    color: 'hover:bg-blue-500 hover:text-white',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getShareUrl: (url, title) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
  },
  {
    name: 'Email',
    ariaLabel: 'Share via Email',
    color: 'hover:bg-gray-600 hover:text-white',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    getShareUrl: (url, title, description) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  }
];

/**
 * Copy Link Component
 */
interface CopyLinkProps {
  url: string;
}

const CopyLink: React.FC<CopyLinkProps> = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn(
        'transition-all duration-200',
        copied ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'
      )}
      aria-label="Copy link to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </>
      )}
    </Button>
  );
};

/**
 * Share Button Component
 */
interface ShareButtonProps {
  platform: SharePlatform;
  url: string;
  title: string;
  description: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ platform, url, title, description }) => {
  const handleShare = () => {
    const shareUrl = platform.getShareUrl(url, title, description);
    
    if (platform.name === 'Email') {
      window.location.href = shareUrl;
    } else {
      window.open(
        shareUrl,
        'share-dialog',
        'width=600,height=400,resizable=yes,scrollbars=yes'
      );
    }

    // Track sharing event (analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform.name.toLowerCase(),
        content_type: 'testimonials_page',
        item_id: 'testimonials'
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={cn(
        'transition-all duration-200 flex items-center gap-2',
        platform.color
      )}
      aria-label={platform.ariaLabel}
    >
      {platform.icon}
      <span className="hidden sm:inline">{platform.name}</span>
    </Button>
  );
};

/**
 * Social Share Buttons Component
 */
export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description,
  className
}) => {
  // Don't render on server side to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn('mb-8', className)}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">Share These Testimonials</h3>
                <Badge variant="secondary" className="text-xs">
                  Help others discover quality work
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Share professional testimonials and help others make informed decisions about collaboration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Social Platform Buttons */}
              {sharePlatforms.map((platform) => (
                <ShareButton
                  key={platform.name}
                  platform={platform}
                  url={url}
                  title={title}
                  description={description}
                />
              ))}

              {/* Copy Link Button */}
              <CopyLink url={url} />
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};