// ОТКЛЮЧЕННЫЙ SERVICE WORKER ДЛЯ ПОЛНОГО СБРОСА КЭША

self.addEventListener("install", event => {
  // сразу активируется, не кэширует ничего
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // удаляем ВСЕ существующие кэши
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // ВСЕ запросы идут напрямую в интернет
  event.respondWith(fetch(event.request));
});
