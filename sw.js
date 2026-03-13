const CACHE_NAME = 'tracker-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './logo.png'
];

// Install the Service Worker and cache files
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Serve files from cache when offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
