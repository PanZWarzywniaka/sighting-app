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
/**
 * installing service worker
 */
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

/**
 * activates service worker and initialises indexDB
 */
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
/**
 * defines what service worker should do for fetching
 * network first -> update cache and if offline serve from cache
 */
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
                    return caches.match(event.request)
                })
        )
    } catch (err) {
        console.log(`Respond with err: ${err}`)
    }

});
/**
 * success handler for reading all sightings from sighting store
 * sends list of sightings to be added to mogodb
 * @param ev
 */
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
/**
 * success handler for reading all chats from chat store
 * sends list of chats to be added to mogodb
 * @param ev
 */
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

/**
 * function to send list of objects to mongodb
 * fetches the endpoints and endpoints add to mongoDB
 * @param objects - objects to be added
 * @param endpoint - which endpoint being used
 * @param objectStoreName - which object store objects came from
 * @returns {Promise<Response>}
 */
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

/**
 * defines what service worker should do for a sync event
 */
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