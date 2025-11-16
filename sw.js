// Версия кэша — меняй номер при крупных обновлениях приложения
const CACHE_NAME = 'staradam-cache-v3';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './cosmos.mp3',
  './icon-192.png',
  './icon-512.png'
];

// Установка service worker и предзагрузка нужных файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Активация — чистим старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const request = event.request;

  // Кэшируем только GET и только тот же домен
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request)
        .then(response => {
          // В кэш кладём только обычные успешные ответы
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cachedResponse); // если оффлайн — поднимаем из кэша

      // Если уже есть в кэше — отдаем его сразу, а в фоне обновляем
      return cachedResponse || fetchPromise;
    })
  );
});
