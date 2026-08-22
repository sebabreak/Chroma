// ══════════════════════════════════════════════════════════════════
//  SERVICE WORKER — rende l'app installabile ("Aggiungi a schermata
//  Home") e utilizzabile anche offline. Mette in cache solo i FILE
//  DELL'INTERFACCIA (html/css/js/icone): il modello AI (sezione 10 di
//  script.js) ha una sua cache separata, gestita internamente dalla
//  libreria WebLLM la prima volta che viene scaricato.
//
//  QUANDO MODIFICHI index.html / style.css / script.js: alza il numero
//  di CACHE_NAME qui sotto (es. v1 → v2), altrimenti i telefoni che
//  hanno già installato l'app potrebbero continuare a vedere la
//  versione vecchia dalla cache invece di quella aggiornata.
// ══════════════════════════════════════════════════════════════════
const CACHE_NAME = 'sovrainterpretazione-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// all'installazione, scarica e mette in cache tutti i file dell'interfaccia
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // attiva subito la nuova versione, senza aspettare la chiusura di tutte le schede
  );
});

// all'attivazione, elimina le cache di versioni precedenti (vedi CACHE_NAME sopra)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// strategia "stale-while-revalidate": risponde subito con la cache (veloce,
// funziona anche offline), poi in background scarica la versione aggiornata
// e la salva per la prossima volta. Tocca SOLO le richieste verso questo
// stesso sito: lascia passare senza toccarle le richieste verso esm.run e
// verso i pesi del modello AI (Hugging Face/CDN di WebLLM), che gestiscono
// già da soli la propria cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => cached); // offline e non in cache: fallisce silenziosamente
      return cached || network;
    })
  );
});
