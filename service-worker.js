
const CACHE_NAME = "moffel-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.html",
  "/assets/layout.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
