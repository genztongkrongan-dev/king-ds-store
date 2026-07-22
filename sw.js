/* =========================================================
   SERVICE WORKER - King DS Store PWA
   Strategi: stale-while-revalidate untuk aset statis (selalu
   coba ambil versi terbaru dari jaringan, tampilkan cache dulu
   biar cepat, lalu perbarui cache diam-diam) dan network-first
   untuk halaman HTML supaya konten tetap up to date.
========================================================= */

const CACHE_NAME = "kingds-cache-v2";

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
// stale-while-revalidate untuk aset statis (css/js/gambar):
// langsung tampilkan cache (cepat), sambil diam-diam ambil versi
// terbaru dari jaringan dan simpan ke cache untuk kunjungan berikutnya.
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
        caches.open(CACHE_NAME).then(cache =>
            cache.match(request).then(cached => {
                const networkFetch = fetch(request)
                    .then(response => {
                        if (response && response.status === 200 && response.type === "basic") {
                            cache.put(request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => cached);

                return cached || networkFetch;
            })
        )
    );
});
