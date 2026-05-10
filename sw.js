// ═══════════════════════════════════════════════════════
// StudyLab Service Worker — PWA Offline Support
// ═══════════════════════════════════════════════════════

const CACHE_NAME = "studylab-v1";
const OFFLINE_URL = "/";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/api.js",
  "/questions.js",
  "/page-home.js",
  "/page-study.js",
  "/page-updates.js",
  "/page-stats.js",
  "/page-info.js",
  "/page-daily.js",
  "/page-digest.js",
  "/logo.png",
  "/manifest.json",
  "/page-shorts.js",
  "/page-skilltree.js",
];

// ── INSTALL: Cache all assets ──
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE: Clean old caches ──
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ── FETCH: Network first, fallback to cache ──
self.addEventListener("fetch", function (e) {
  // Skip non-GET and external requests
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(function (response) {
        // Cache fresh responses
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(function () {
        // Offline fallback
        return caches.match(e.request).then(function (cached) {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});

// ── PUSH NOTIFICATIONS ──
self.addEventListener("push", function (e) {
  var data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || "StudyLab 📚", {
      body: data.body || "You have a new update!",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || "/")
  );
});
