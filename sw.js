/* ROM GYM — service worker: la app queda disponible sin internet. */
var CACHE = 'romgym-v3';
var ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './icon-maskable.svg',
  './img/01-piernas-a.png', './img/02-piernas-b.png', './img/03-pecho-y-biceps.png',
  './img/04-espalda-y-triceps.png', './img/05-hombros.png', './img/06-abdomen.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .catch(function () {})
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  /* Las llamadas vivas a la nube y al login siempre van a la red. El SDK de
     Firebase (gstatic, con la versión en la URL) sí se guarda, para que la
     app pueda abrir sin señal. */
  var url = req.url;
  if (url.indexOf('googleapis.com') >= 0 || url.indexOf('accounts.google.com') >= 0 ||
      url.indexOf('firebaseio.com') >= 0 || url.indexOf('firebaseapp.com') >= 0) return;

  /* La página: primero la red, con la copia guardada como respaldo. */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (hit) { return hit || caches.match('./'); });
        })
    );
    return;
  }

  /* Todo lo demás (figuras, tipografías, SDK): primero la copia guardada. */
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return caches.match(req); });
    })
  );
});
