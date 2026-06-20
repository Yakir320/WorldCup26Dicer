// Service worker — NETWORK-FIRST for the page so deploys always show up.
// (The old cache-first version could pin a stale index.html forever.)
const C = 'wc26-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // live data + proxies always go to the network, never cached by us
  if (/espn\.com|corsproxy|allorigins|workers\.dev/.test(u.hostname)) return;
  const isPage = e.request.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('index.html');
  if (isPage) {
    // network-first: fetch fresh, update cache, fall back to cache only when offline
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
  } else {
    // static assets (icon/manifest): cache-first is fine
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
