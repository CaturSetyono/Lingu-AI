/**
 * Service Worker for LinguAI Studio
 * Handles offline functionality and asset caching
 */

const CACHE_NAME = "linguai-v2";
// Only cache truly static assets (NOT SSR pages like /app or /)
const CACHE_URLS = [
  "/manifest.json",
  "/favicon.svg",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS).catch((error) => {
        console.warn("SW: Some assets failed to cache:", error);
      });
    })
  );
  // Immediately take control without waiting for old SW to expire
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("SW: Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // API calls: network-first, no cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({
            success: false,
            error: "You appear to be offline. Please check your connection.",
          }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        )
      )
    );
    return;
  }

  // Static assets & pages: cache-first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Only cache valid responses
          if (
            response &&
            response.status === 200 &&
            response.type !== "error"
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // For navigation requests when offline, return a network error response
          if (request.mode === "navigate") {
            return new Response("You are offline. Please check your connection.", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            });
          }
          return new Response("Resource unavailable", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});
