"use client";
import React, { useState } from 'react';
import { FaShare, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  title, 
  text, 
  url, 
  className = "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
}) => {
  const [shareState, setShareState] = useState<'idle' | 'success' | 'error'>('idle');

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    try {
      // Check if Web Share API is supported and available
      if (navigator.share) {
        const shareData = { title, text, url: shareUrl };
        
        // Check if the data can be shared (canShare is optional)
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setShareState('success');
          setTimeout(() => setShareState('idle'), 2000);
          return;
        }
      }
      
      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareState('success');
        setTimeout(() => setShareState('idle'), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setShareState('success');
          setTimeout(() => setShareState('idle'), 2000);
        } catch (err) {
          setShareState('error');
          setTimeout(() => setShareState('idle'), 3000);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      // Handle AbortError (user cancelled) silently
      if (error instanceof Error && error.name === 'AbortError') {
        return; // User cancelled - this is normal behavior
      }
      
      // For other errors, try clipboard fallback
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          setShareState('success');
          setTimeout(() => setShareState('idle'), 2000);
        } else {
          setShareState('error');
          setTimeout(() => setShareState('idle'), 3000);
        }
      } catch (clipboardError) {
        setShareState('error');
        setTimeout(() => setShareState('idle'), 3000);
      }
    }
  };

  const getButtonContent = () => {
    switch (shareState) {
      case 'success':
        return (
          <>
            <FaCheck className="mr-2" />
            {typeof window !== 'undefined' && navigator.share ? 'Shared!' : 'Copied!'}
          </>
        );
      case 'error':
        return (
          <>
            <FaExclamationTriangle className="mr-2" />
            Error
          </>
        );
      default:
        return (
          <>
            <FaShare className="mr-2" />
            Share
          </>
        );
    }
  };

  const getButtonClassName = () => {
    switch (shareState) {
      case 'success':
        return className.replace('bg-blue-600', 'bg-green-600').replace('hover:bg-blue-700', 'hover:bg-green-700');
      case 'error':
        return className.replace('bg-blue-600', 'bg-red-600').replace('hover:bg-blue-700', 'hover:bg-red-700');
      default:
        return className;
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={shareState !== 'idle'}
      className={getButtonClassName()}
      aria-label={shareState === 'idle' ? 'Share this content' : shareState === 'success' ? 'Content shared successfully' : 'Share failed'}
    >
      {getButtonContent()}
    </button>
  );
};

export default ShareButton;