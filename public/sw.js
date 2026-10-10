/* LangSpot service worker: conservative same-origin runtime caching. */
const VERSION = 'langspot-shell-v1';
const CORE = ['./', './manifest.webmanifest', './data/manifest.json', './data/languages.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE.map(x => new Request(x, {cache:'reload'}))).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('langspot-') && k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    if (response.ok && (req.destination === 'document' || req.destination === 'script' || req.destination === 'style' || new URL(req.url).pathname.includes('/data/'))) {
      const copy = response.clone(); caches.open(VERSION).then(cache => cache.put(req, copy));
    }
    return response;
  }).catch(() => caches.match('./'))));
});
