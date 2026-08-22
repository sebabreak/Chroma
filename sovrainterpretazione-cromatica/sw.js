// ══════════════════════════════════════════════════════════════════
//  SERVICE WORKER — rende l'app installabile ("Aggiungi a schermata
//  Home") e utilizzabile anche offline. Mette in cache solo i FILE
//  DELL'INTERFACCIA (html/css/js/icone): il modello AI (sezione 10 di
//  script.js) ha una sua cache separata, gestita internamente dalla
//  libreria WebLLM la prima volta che viene scaricato.
//
//  STRATEGIA: "network-first" — prova sempre prima a scaricare la
//  versione più recente da internet, e usa la cache solo come riserva
//  se il telefono è offline. Così, finché il telefono ha connessione,
//  vede sempre l'ultima versione caricata su GitHub senza bisogno di
//  nessun accorgimento manuale; la cache serve solo quando manca la
//  rete (uso "vero" da app installata, in giro senza connessione).
//
//  QUANDO MODIFICHI index.html / style.css / script.js: alza comunque il
//  numero di CACHE_NAME qui sotto (es. v1 → v2). Non è più indispensabile
//  per vedere le modifiche (la strategia network-first se ne occupa da
//  sola quando il telefono è online), ma pulisce la cache vecchia invece
//  di lasciarla lì a occupare spazio inutilmente.
// ══════════════════════════════════════════════════════════════════
const CACHE_NAME = 'sovrainterpretazione-v2';

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

// strategia "network-first, con la cache solo come riserva": prova sempre
// prima la rete (così si vede subito l'ultima versione pubblicata), e
// ricade sulla cache SOLO se la rete non risponde (telefono offline).
// Tocca SOLO le richieste verso questo stesso sito: lascia passare senza
// toccarle le richieste verso esm.run e verso i pesi del modello AI
// (Hugging Face/CDN di WebLLM), che gestiscono già da soli la propria cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
        return res;
      })
      .catch(() => caches.match(req)) // offline: usa l'ultima copia salvata, se c'è
  );
});
