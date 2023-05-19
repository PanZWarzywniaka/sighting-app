import * as idb from "./indexedDB.js";

let requestIDB = idb.connectToIDB(() => {
    console.log("connected to idb on chat page")
});

/**
 * Registers a sync event when user is offline and adds chat to IDB
 * @param sightingData - sighting object
 * @param username - username of user submitting chat
 */
function registerChatSync(sightingData, username) {
    // only register sync when user offline
    let roomNo = sightingData._id
    let chat_text = document.getElementById("chat_input").value
    let date = new Date()
    let chat_obj = {username:username,sightingId:roomNo,message:chat_text,created_at:date.toString()}

    if(!navigator.onLine){
        // add current chat to indexedDB
        idb.saveValue("chats",requestIDB,chat_obj)
        console.log("Chat saved!")
        new Promise(function (resolve,reject) {
            Notification.requestPermission(function(result) {
                resolve();
            })
        }).then(function () {
            return navigator.serviceWorker.ready;
        }).then(function (reg) {
            try {
                return reg.sync.register("chat_sync");

            } catch {
                console.log("Background sync failed !");
            }
        }).then(function () {
            console.info('Chat sync registered');
        }).catch(function (err) {
            console.error(`Failed to register chat sync ${err.message}`)
        });
    }

}
// creating function in window for use when loading
window.registerChatSync = registerChatSync;
