const CACHE_NAME = 'chroma-v10';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './qr-telefono.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];


// INSTALLAZIONE
self.addEventListener('install', event => {

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );

});


// ATTIVAZIONE
// elimina automaticamente le vecchie cache
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


// FETCH
// online = prende la versione più recente
// offline = usa la cache
self.addEventListener('fetch', event => {

  const request = event.request;

  if (
    request.method !== 'GET' ||
    new URL(request.url).origin !== location.origin
  ) {
    return;
  }

  event.respondWith(

    fetch(request, { cache: 'no-store' })

      .then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, copy));

        return response;

      })

      .catch(() => caches.match(request))

  );

});
