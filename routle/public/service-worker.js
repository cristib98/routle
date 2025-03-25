// Cache name with version
const CACHE_NAME = "routle-cache-v1";

// Get the base URL from the location
const getBaseUrl = () => {
  const pathSegments = location.pathname.split("/");
  return pathSegments.slice(0, pathSegments.length - 1).join("/") || "/";
};

// List of resources to cache
const urlsToCache = [
  getBaseUrl(),
  `${getBaseUrl()}/index.html`,
  `${getBaseUrl()}/manifest.json`,
  `${getBaseUrl()}/favicon.ico`,
  `${getBaseUrl()}/logo192.png`,
  `${getBaseUrl()}/logo512.png`,
  `${getBaseUrl()}/data/world-110m.json`,
  // Add other critical files
];

// Install service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch resources from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Clone the request to make a network request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone response to cache and return
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          // Show offline page if network fails
          console.log("Fetch failed:", error);
          // You can return a custom offline page here
        });
    })
  );
});

// Clean up old caches when new service worker activates
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
