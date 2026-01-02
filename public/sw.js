// ======================
// sw.js – HyperCalc Ultra Offline
// ======================

const CACHE_NAME = 'hypercalc-ultra-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './ui.js',
  './calculator.js',
  './geometry.js',
  './auto_trainer.js',
  './canvas-measure.js',
  './core/engine.v3.js',
  './physics/sandbox.js',
  './physics/body.js',
  './physics/world.js',
  './physics/integrator.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

// Message from Page
self.addEventListener('message', event => {
  if (event.data === 'UPDATE_NOW') self.skipWaiting();
});

// ======================
// Background Sync for AutoTrainer (IndexedDB)
// ======================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-auto-trainer') {
    event.waitUntil(
      // پیام به page برای ذخیره Offline AutoTrainer
      self.clients.matchAll().then(clients =>
        clients.forEach(client => client.postMessage({ type: 'SYNC_AUTOTRAINER' }))
      )
    );
  }
});
