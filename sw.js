const CACHE_NAME = 'scout-offline-v2';

// Salva o esqueleto do site
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => {
            return c.addAll(['./', './index.html']);
        })
    );
});

// O Sugador Inteligente para rodar sem internet
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            if (res) return res;
            
            return fetch(e.request).then(newRes => {
                if(e.request.url.startsWith('http')) {
                    const clone = newRes.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return newRes;
            });
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
