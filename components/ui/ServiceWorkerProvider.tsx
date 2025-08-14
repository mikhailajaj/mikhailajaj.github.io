/**
 * Service Worker Provider Component
 * 
 * Handles service worker registration and provides update notifications
 */

"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaTimes, FaSync } from 'react-icons/fa';
import { useServiceWorker } from '@/lib/utils/serviceWorker';
import { Button } from '@/components/ui/base/Button';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

/**
 * Update notification component
 */
const UpdateNotification: React.FC<{
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}> = ({ isVisible, onUpdate, onDismiss }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <FaSync className="text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Update Available
                </h3>
              </div>
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={14} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              A new version of the portfolio is available. Update now for the latest features and improvements.
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={onUpdate}
                leftIcon={<FaDownload />}
              >
                Update Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Cache info component for development
 */
const CacheInfo: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<{
    totalSize: number;
    details: Array<{ name: string; size: number; entries: number }>;
  } | null>(null);
  
  const { manager } = useServiceWorker();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      manager.getCacheInfo().then(setCacheInfo);
    }
  }, [manager]);

  if (process.env.NODE_ENV !== 'development' || !cacheInfo) {
    return null;
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <details className="bg-gray-900 text-white text-xs rounded p-2">
        <summary className="cursor-pointer">
          Cache: {formatSize(cacheInfo.totalSize)}
        </summary>
        <div className="mt-2 space-y-1">
          {cacheInfo.details.map((cache) => (
            <div key={cache.name} className="flex justify-between">
              <span className="truncate">{cache.name}</span>
              <span>{cache.entries} items</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

/**
 * Service Worker Provider Component
 */
export const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({
  children,
}) => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const {
    isSupported,
    isRegistered,
    isUpdateAvailable,
    activateUpdate,
  } = useServiceWorker();

  // Show update notification when available
  useEffect(() => {
    if (isUpdateAvailable && !dismissed) {
      setShowUpdateNotification(true);
    }
  }, [isUpdateAvailable, dismissed]);

  const handleUpdate = () => {
    activateUpdate();
    setShowUpdateNotification(false);
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
    setDismissed(true);
  };

  // Log service worker status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[SW Provider] Service Worker Status:', {
        isSupported,
        isRegistered,
        isUpdateAvailable,
      });
    }
  }, [isSupported, isRegistered, isUpdateAvailable]);

  return (
    <>
      {children}
      
      <UpdateNotification
        isVisible={showUpdateNotification}
        onUpdate={handleUpdate}
        onDismiss={handleDismiss}
      />
      
      <CacheInfo />
    </>
  );
};

export default ServiceWorkerProvider;