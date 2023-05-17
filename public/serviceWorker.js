
const CACHE_STATIC_NAME = 'static-sighting';
const CACHE_DYNAMIC_NAME = 'static-sighting';
let cache= null;
let filesToCache = [
    '/',
    '/stylesheets/style.css',
    '/javascripts/add.js',
    '/javascripts/chat.js',
    '/javascripts/index.js',
    '/javascripts/indexedDB.js',
    '/javascripts/map.js',
    '/javascripts/nav.js',
    '/javascripts/sighting.js',
    '/partials/head.ejs',
    '/partials/header.ejs',
    '/partials/footer.ejs',
    '/offline.ejs',
    'birds.csv'

];
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function (cacheX) {
            console.log('[ServiceWorker] Caching app shell');
            cache= cacheX;
            return cache.addAll(filesToCache);
        }).catch((err) => {
            console.log(`Error: ${err}`)
        })
    );
});

//clear cache on reload
self.addEventListener('activate', function (e) {
    // initialise idb in this event listener
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
})
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clonedResponse = response.clone();

                caches.open(CACHE_STATIC_NAME)
                    .then((cache) => {
                        if (event.request.method === "GET")
                            // Update the cache
                            cache.put(event.request, clonedResponse);
                    });
                return response;
            })
            .catch((err) => {
                // when offline return cached requests
                // need to change this so if:
                // event.request.url contains "/add" and event.request.method === "POST"
                if (event.request.url.indexOf("/add") > -1 && event.request.method === "POST")
                    console.log("*******************YOU HAVE CREATED A SIGHTING WHEN OFFLINE**********************")
                // then sighting needs to be added to indexedDB
                return caches.match(event.request)
            })
    );
});

self.addEventListener('sync', (event) => {
    console.info('Event: Sync', event);
    if(event.tag === 'chat_sync') {
        console.log('Nothing done rn just checking if offline pages work')
    } else if (event.tag === 'sighting_sync'){
        // Write code for what to do when sighting added if online/offline
        console.log('Nothing done right now')
    }
})