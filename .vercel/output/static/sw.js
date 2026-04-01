/**
 * Service Worker for LinguAI Studio
 * Handles offline functionality and asset caching
 */

const CACHE_NAME = "linguai-v1";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/favicon.ico",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS).catch((error) => {
        console.log("Cache addAll error:", error);
      });
    }),
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - network-first strategy for API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions
  if (url.origin !== location.origin) {
    return;
  }

  // API calls: network-first with timeout
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache error responses
          if (response && response.status === 200) {
            const cloneRes = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cloneRes);
            });
          }
          return response;
        })
        .catch(async () => {
          // Fall back to cache if network fails
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // Return offline response
          return new Response(
            JSON.stringify({
              success: false,
              error: "You appear to be offline. Please check your connection.",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
    );
  } else {
    // Static assets: cache-first
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type === "error"
            ) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === "navigate") {
              return caches.match("/");
            }
            return new Response("Resource unavailable", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            });
          });
      }),
    );
  }
});

// Background sync (optional, for future features)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-rewrites") {
    event.waitUntil(
      Promise.resolve().then(() => {
        // Logic for syncing saved rewrites
      }),
    );
  }
});
