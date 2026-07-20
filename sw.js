/* =========================================================
   SERVICE WORKER - King DS Store PWA
   Strategi: cache-first untuk aset statis, selalu coba
   jaringan dulu untuk halaman HTML supaya konten tetap up to date.
========================================================= */

const CACHE_NAME = "kingds-cache-v1";

const STATIC_ASSETS = [
    "index.html",
    "products.html",
    "css/style.css",
    "js/script.js",
    "js/products.js",
    "images/logo.png",
    "manifest.json"
];

// INSTALL: simpan aset statis inti ke cache
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// ACTIVATE: bersihkan cache versi lama
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// FETCH: network-first untuk halaman HTML (konten selalu fresh),
// cache-first untuk aset statis (css/js/gambar) supaya cepat & bisa offline.
self.addEventListener("fetch", event => {
    const { request } = event;

    if (request.method !== "GET") return;

    const isHTML = request.mode === "navigate" || request.destination === "document";

    if (isHTML) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request).then(cached => cached || caches.match("index.html")))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;

            return fetch(request)
                .then(response => {
                    // hanya cache respons yang valid & same-origin
                    if (response && response.status === 200 && response.type === "basic") {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
        })
    );
});
