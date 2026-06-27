/* ============================================================
   RANGSAR STUDIO — sw.js (Service Worker)
   Makes the website installable & work offline
   ============================================================ */

const CACHE_NAME = 'rangsar-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './cart.js',
  './products.js',
  './logo.png',
  './manifest.json'
];

// Install — cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available, else fetch from network
      return response || fetch(event.request).catch(() => {
        // If both fail (offline), return index.html
        return caches.match('./index.html');
      });
    })
  );
});
