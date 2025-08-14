/**
 * Service Worker Registration and Management
 * 
 * Handles service worker lifecycle, updates, and user notifications
 */

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Check if service workers are supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  /**
   * Register service worker
   */
  async register(): Promise<ServiceWorkerStatus> {
    if (!ServiceWorkerManager.isSupported()) {
      console.log('[SW Manager] Service workers not supported');
      return {
        isSupported: false,
        isRegistered: false,
        isUpdateAvailable: false,
        registration: null,
      };
    }

    try {
      console.log('[SW Manager] Registering service worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[SW Manager] Service worker registered successfully');

      // Set up event listeners
      this.setupEventListeners();

      // Check for updates
      this.checkForUpdates();

      return {
        isSupported: true,
        isRegistered: true,
        isUpdateAvailable: this.updateAvailable,
        registration: this.registration,
      };
    } catch (error) {
      console.error('[SW Manager] Service worker registration failed:', error);
      
      return {
        isSupported: true,
        isRegistered: false,
        isUpdateAvailable: false,
        registration: null,
      };
    }
  }

  /**
   * Set up service worker event listeners
   */
  private setupEventListeners(): void {
    if (!this.registration) return;

    // Listen for updates
    this.registration.addEventListener('updatefound', () => {
      console.log('[SW Manager] Update found');
      const newWorker = this.registration!.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW Manager] Update available');
            this.updateAvailable = true;
            this.emit('updateAvailable', this.registration);
          }
        });
      }
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW Manager] Controller changed - reloading page');
      window.location.reload();
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW Manager] Message from service worker:', event.data);
      this.emit('message', event.data);
    });
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('[SW Manager] Checked for updates');
    } catch (error) {
      console.error('[SW Manager] Update check failed:', error);
    }
  }

  /**
   * Activate waiting service worker
   */
  async activateUpdate(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.log('[SW Manager] No update waiting');
      return;
    }

    console.log('[SW Manager] Activating update...');
    
    // Send message to waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      console.log('[SW Manager] No registration to unregister');
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('[SW Manager] Service worker unregistered:', result);
      this.registration = null;
      return result;
    } catch (error) {
      console.error('[SW Manager] Failed to unregister service worker:', error);
      return false;
    }
  }

  /**
   * Get cache usage information
   */
  async getCacheInfo(): Promise<{
    caches: string[];
    totalSize: number;
    details: Array<{ name: string; size: number; entries: number }>;
  }> {
    if (!('caches' in window)) {
      return { caches: [], totalSize: 0, details: [] };
    }

    try {
      const cacheNames = await caches.keys();
      const details = [];
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        let cacheSize = 0;

        // Estimate cache size (rough calculation)
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            cacheSize += blob.size;
          }
        }

        details.push({
          name: cacheName,
          size: cacheSize,
          entries: keys.length,
        });

        totalSize += cacheSize;
      }

      return {
        caches: cacheNames,
        totalSize,
        details,
      };
    } catch (error) {
      console.error('[SW Manager] Failed to get cache info:', error);
      return { caches: [], totalSize: 0, details: [] };
    }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      console.log('[SW Manager] All caches cleared');
      return true;
    } catch (error) {
      console.error('[SW Manager] Failed to clear caches:', error);
      return false;
    }
  }

  /**
   * Send message to service worker
   */
  sendMessage(message: any): void {
    if (!navigator.serviceWorker.controller) {
      console.warn('[SW Manager] No service worker controller available');
      return;
    }

    navigator.serviceWorker.controller.postMessage(message);
  }

  /**
   * Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  /**
   * Get current status
   */
  getStatus(): ServiceWorkerStatus {
    return {
      isSupported: ServiceWorkerManager.isSupported(),
      isRegistered: !!this.registration,
      isUpdateAvailable: this.updateAvailable,
      registration: this.registration,
    };
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

/**
 * React hook for service worker management
 */
export function useServiceWorker() {
  const [status, setStatus] = React.useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null,
  });

  React.useEffect(() => {
    // Register service worker on mount
    serviceWorkerManager.register().then(setStatus);

    // Listen for updates
    const handleUpdate = () => {
      setStatus(serviceWorkerManager.getStatus());
    };

    serviceWorkerManager.on('updateAvailable', handleUpdate);

    return () => {
      serviceWorkerManager.off('updateAvailable', handleUpdate);
    };
  }, []);

  const activateUpdate = React.useCallback(() => {
    serviceWorkerManager.activateUpdate();
  }, []);

  const clearCaches = React.useCallback(() => {
    return serviceWorkerManager.clearCaches();
  }, []);

  return {
    ...status,
    activateUpdate,
    clearCaches,
    manager: serviceWorkerManager,
  };
}

// Import React for the hook
import React from 'react';