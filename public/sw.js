/**
 * Service Worker for Mikhail Ajaj Portfolio
 * 
 * Implements comprehensive caching strategy for optimal performance
 * on static export deployment (GitHub Pages)
 */

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const IMAGE_CACHE = 'images-v1.0.0';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Core pages
  '/about',
  '/projects',
  '/experience',
  '/contact',
  // Critical CSS and JS will be added dynamically
];

// Cache strategies for different asset types
const CACHE_STRATEGIES = {
  // Static assets - Cache first, network fallback
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  // Dynamic content - Network first, cache fallback
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'networkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  // Images - Cache first with long expiry
  images: {
    cacheName: IMAGE_CACHE,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
        
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Handle all network requests
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

/**
 * Handle different types of requests with appropriate caching strategies
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different asset types
    if (isImageRequest(request)) {
      return handleImageRequest(request);
    } else if (isStaticAsset(request)) {
      return handleStaticAsset(request);
    } else if (isAPIRequest(request)) {
      return handleAPIRequest(request);
    } else {
      return handlePageRequest(request);
    }
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    return handleOfflineFallback(request);
  }
}

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid
    const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
    const now = new Date();
    
    if (now - cacheDate < CACHE_STRATEGIES.images.maxAge) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response and add cache date
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });
      
      cache.put(request, modifiedResponse);
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for image, serving from cache:', error);
  }
  
  return cachedResponse || handleOfflineFallback(request);
}

/**
 * Handle static assets (CSS, JS, fonts) with cache-first strategy
 */
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Serve from cache and update in background
    updateCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for static asset:', error);
  }
  
  return handleOfflineFallback(request);
}

/**
 * Handle API requests with network-first strategy
 */
async function handleAPIRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for API, serving from cache:', error);
  }
  
  const cachedResponse = await cache.match(request);
  return cachedResponse || handleOfflineFallback(request);
}

/**
 * Handle page requests with network-first strategy
 */
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for page, serving from cache:', error);
  }
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to cached homepage for navigation requests
  if (request.mode === 'navigate') {
    const homepageCache = await cache.match('/');
    if (homepageCache) {
      return homepageCache;
    }
  }
  
  return handleOfflineFallback(request);
}

/**
 * Update cache in background without blocking response
 */
function updateCacheInBackground(request, cache) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response);
      }
    })
    .catch((error) => {
      console.log('[SW] Background cache update failed:', error);
    });
}

/**
 * Handle offline fallbacks
 */
async function handleOfflineFallback(request) {
  if (request.mode === 'navigate') {
    // Return offline page for navigation requests
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Return generic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline',
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Utility functions to identify request types
 */
function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(url.pathname) ||
         request.destination === 'image';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
         url.pathname.startsWith('/_next/static/');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

/**
 * Background sync for form submissions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

/**
 * Handle background sync for contact form
 */
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data),
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('[SW] Form submission synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync form submission:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

/**
 * IndexedDB helpers for offline form submissions
 */
async function getPendingSubmissions() {
  // Implementation would use IndexedDB to store pending submissions
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would remove submission from IndexedDB
  console.log('[SW] Removing pending submission:', id);
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/icon-explore.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service worker script loaded');