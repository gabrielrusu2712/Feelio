/* Feelio service worker — makes the app installable and gives it an offline
 * app shell. Strategy:
 *   - navigations: network-first (new deploys win) with an offline fallback to
 *     the cached index shell;
 *   - same-origin static assets: cache-first, populated at runtime (Vite hashes
 *     asset filenames, so a cached hash is immutable and safe to keep);
 *   - cross-origin requests (Firebase Auth/Firestore, the Gemini chat Worker,
 *     Leaflet map tiles): left untouched so realtime/auth/network behaviour is
 *     never altered by the cache.
 * Bump CACHE to invalidate everything on a breaking change.
 */
const CACHE = 'feelio-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // App navigations: try the network first, fall back to the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/'))),
    )
    return
  }

  // Static same-origin assets: serve from cache, otherwise fetch and store.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
