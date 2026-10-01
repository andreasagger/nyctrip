const V = "nyc-v3";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/apple-touch-icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== "nyc-tiles").map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function networkFirst(req, cacheName) {
  const c = await caches.open(cacheName);
  try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
  catch (e) { const m = await c.match(req, { ignoreSearch: false }); if (m) return m; throw e; }
}
async function cacheFirst(req, cacheName) {
  const c = await caches.open(cacheName);
  const m = await c.match(req); if (m) return m;
  const r = await fetch(req); if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r;
}

self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.pathname.startsWith("/api/")) return;                       // shared checklist: always live
  if (u.hostname === "tile.openstreetmap.org") { e.respondWith(cacheFirst(req, "nyc-tiles")); return; }
  if (u.hostname.includes("open-meteo.com")) { e.respondWith(networkFirst(req, V)); return; }
  if (req.mode === "navigate") { e.respondWith(networkFirst(req, V).catch(() => caches.match("/index.html"))); return; }
  e.respondWith(networkFirst(req, V));
});
