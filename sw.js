/* ROM GYM — service worker: la app queda disponible sin internet. */
var CACHE = 'romgym-v5';
var EJERCICIOS = [
  '01-prensa', '02-curl-femoral-sentado', '03-sentadilla-smith', '04-zancadas',
  '05-extension-cuadriceps', '06-gemelos-de-pie', '07-aductores', '08-bulgara',
  '09-peso-muerto-rumano-mancuernas', '10-hip-thrust', '11-press-inclinado',
  '12-curl-biceps-barra', '13-press-plano', '14-curl-predicador', '15-mariposas-pec-deck',
  '16-flexiones', '17-dominadas', '18-extension-triceps-polea', '19-remo-sentado',
  '20-fondos', '21-jalon-al-pecho', '22-pushdown-triceps', '23-face-pull',
  '24-press-hombros-mancuernas', '25-elevaciones-laterales', '26-reverse-pec-deck',
  '27-plancha', '28-crunch', '29-abdominal-con-rueda', '30-elevaciones-de-piernas'
];
var ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './icon-maskable.svg',
  './img/01-piernas-a.png', './img/02-piernas-b.png', './img/03-pecho-y-biceps.png',
  './img/04-espalda-y-triceps.png', './img/05-hombros.png', './img/06-abdomen.png'
].concat(EJERCICIOS.map(function (n) { return './img/ej/' + n + '.png'; }));

self.addEventListener('install', function (e) {
  /* Uno por uno: si una figura falla, no se cae toda la instalacion. */
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        return Promise.all(ASSETS.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      })
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

  /* Las llamadas vivas a la nube y todo el flujo de login van siempre a la
     red. El SDK de Firebase (gstatic, con la version en la URL) si se guarda,
     para que la app pueda abrir sin senal. */
  var url = req.url;
  if (url.indexOf('googleapis.com') >= 0 || url.indexOf('accounts.google.com') >= 0 ||
      url.indexOf('firebaseio.com') >= 0 || url.indexOf('firebaseapp.com') >= 0) return;

  /* La pagina: primero la red, con la copia guardada como respaldo. */
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

  /* Todo lo demas (figuras, tipografias, SDK): primero la copia guardada. */
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
