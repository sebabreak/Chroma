const VERSION = "chroma-v17";
const FILES = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "lab.js",
  "features.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "assets/analoghi.png",
  "assets/avatar-bg.svg",
  "assets/badge-bloccato.svg",
  "assets/chroma-faccia.png",
  "assets/chroma-lettering.png",
  "assets/chroma-logo.png",
  "assets/chroma-omino.png",
  "assets/color-more.svg",
  "assets/color-wheel.png",
  "assets/complementari.png",
  "assets/dots-1.svg",
  "assets/dots-2.svg",
  "assets/dots-3.svg",
  "assets/fire.png",
  "assets/ic-explore.png",
  "assets/ic-home.png",
  "assets/ic-lezioni.png",
  "assets/ic-profilo.png",
  "assets/ic-quest.png",
  "assets/impara-1.png",
  "assets/impara-2.png",
  "assets/impara-3.png",
  "assets/lezione-arancione.png",
  "assets/lezione-blu.png",
  "assets/lezione-viola.png",
  "assets/quadrato.png",
  "assets/quest-bar-1.svg",
  "assets/quest-bar-2.svg",
  "assets/quest-bar-3.svg",
  "assets/quest-bar-dark-1.svg",
  "assets/quest-bar-dark-2.svg",
  "assets/quest-bar-dark-3.svg",
  "assets/rettangolo.png",
  "assets/right-arrow.png",
  "assets/split-complementari.png",
  "assets/time-forward.png",
  "assets/triade.png",
  "assets/vinci-1.png",
  "assets/vinci-2.png",
  "assets/vinci-3.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const same = url.origin === location.origin;
  const net = same ? fetch(url.href, { cache: "no-cache", credentials: "same-origin" }) : fetch(e.request);
  e.respondWith(
    net.then(r => {
      if (r.ok && same) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then(r => r || (e.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
