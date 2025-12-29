self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('hypercalc-v1').then(c =>
      c.addAll(['./','./public/index.html'])
    )
  );
});
