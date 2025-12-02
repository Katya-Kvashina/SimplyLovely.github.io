// sw.js - Service Worker для офлайн-работы и кеширования

const CACHE_NAME = 'f1-app-v1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.css',
    '/theme.js',
    '/app.js',
    '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кешированный response если он есть
                if (response) {
                    return response;
                }
                
                // Иначе делаем сетевой запрос
                return fetch(event.request).then(response => {
                    // Проверяем валидный ли ответ
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Клонируем response
                    const responseToCache = response.clone();
                    
                    // Кешируем новый ресурс
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            }).catch(() => {
                // Fallback для офлайн режима
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                
                // Fallback для изображений
                if (event.request.destination === 'image') {
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">Изображение недоступно</text></svg>',
                        {
                            headers: { 'Content-Type': 'image/svg+xml' }
                        }
                    );
                }
            })
    );
});