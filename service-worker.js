const cacheName = 'palette-mentor-v1'; // Change version when you update the service worker
const assetsToCache = [
  '/', // Cache the root
  '/index.html',
  '/styles.css', // Or the path to your CSS file
  '/script.js',  // Or the path to your main JS file
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/111-small.webp',
  '/111-medium.webp',
  '/paintbrush-cursor.png',
  '/2favicon.ico',
  '/Link.png',
  '/DONATE.png',
  '/333.png',
  '/444.png',
  '/555.png',
  '/666.png',
  '/777.png',
  '/mmyking-insta.png',
  '/TPM-insta.png',
  '/TPM-YT.png',
  '/images/social-preview.webp', // Added
  '/111.webp', // Added
  '/111.png',  // Added
  '/222.webp',  // Added
  '/222.png',  // Added
  '/Link.webp', // Added
  '/DONATE.webp', // Added
  '/333.webp', // Added
  '/333.png',  // Added
  '/444.webp',  // Added
  '/444.png',  // Added
  '/555.webp',  // Added
  '/555.png',  // Added
  '/666.webp',  // Added
  '/666.png',  // Added
  '/777.webp',  // Added
  '/777.png'   // Added
  // Add paths to all your other assets: images, fonts, etc.
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(assetsToCache);
      })
      .catch(err => {
        console.error('[Service Worker] Error caching assets', err);
      })
  );
  //self.skipWaiting(); // Removed:  Good practice to let old tabs finish.
});

// Activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(existingCacheName => {
          if (existingCacheName !== cacheName) {
            console.log('[Service Worker] Removing old cache:', existingCacheName);
            return caches.delete(existingCacheName);
          }
          return null;
        }).filter(promise => promise !== null) // Filter out null promises
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          //console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }

        // Not in cache - fetch from the network
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then(networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response. A response can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
             // Return offline page if the request is for a navigation.
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return null;
          });
      })
  );
});
