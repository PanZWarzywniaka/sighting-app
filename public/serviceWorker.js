const CACHE_STATIC_NAME = 'static-sighting';
const CACHE_DYNAMIC_NAME = 'static-sighting';
import * as idb from '/javascripts/indexedDB.js';
let requestIDB;
let cache= null;
let mongoDB = 'http://127.0.0.1:27017/com3504'
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
    '/manifest.json',
    '/images/bird.png',
    '/images/me_avatar.png',
    '/images/no_image.png',
    '/images/offline_pic.png',
    '/images/pwa_logo.png',
    '/images/user.png',
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
    requestIDB = idb.connectToIDB(() => {
        console.log("connected to idb on Service Worker")
    });
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
    try{
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


                    // then sighting needs to be added to indexedDB

                    return caches.match(event.request)
                })
        )
    } catch (err) {
        console.log(`Respond with err: ${err}`)
    }

});
const readSightingsSuccess = (ev) => {
    if(ev.target.result !== undefined){

        sendToMongoDB(ev.target.result,'/sync-sighting','sightings').then(() => {
            console.log("Sent sightings for syncing")
        }).catch(error => {
            console.log(`Error sending sightings to mgdb: ${error}`)
        })
    } else
        console.log('There are no sightings to read')
}

const readChatsSuccess = (ev) => {
    if(ev.target.result !== undefined){

        sendToMongoDB(ev.target.result,'/sync-chat','chats').then(() => {
            console.log("Sent chats for syncing")
        }).catch(error => {
            console.log(`Error sending sightings to mgdb: ${error}`)
        })
    } else
        console.log('There are no sightings to read')
}
// function to send data to mongoDB <- usually used after readAllValues
function sendToMongoDB(objects,endpoint,objectStoreName){
    const data = JSON.stringify(objects)
    const headers = new Headers()
    headers.append('Content-Type','application/json')

    return fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: data
    }).then( response => {
        if(response.ok){
            console.log('Sent data to mgdb successfully')
            idb.clearStore(objectStoreName,requestIDB)
        }
        else
            throw new Error('Error syncing data to server. Status: ' + response.status + ' ' + response.statusText);
    }).catch(error => {
        console.error(`Error: ${error.message}`)
    })
}
self.addEventListener('sync', (event) => {
    console.info('Event: Sync', event);
    if(event.tag === 'chat_sync') {
        console.log('Nothing done rn just checking if offline pages work')
        idb.readAllValues('chats',requestIDB,readChatsSuccess)
    } else if (event.tag === 'sighting_sync'){
        console.log("SIGHTING SYNC EVENT SEEN")
        idb.readAllValues('sightings',requestIDB,readSightingsSuccess)
    }
})