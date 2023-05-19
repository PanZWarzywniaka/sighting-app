import * as idb from './indexedDB.js';
import * as gMap from "./map.js";
let username = null
let location;
let navMap;
let navMarker;
let requestIDB;

/**
 * Execute when page has been loaded
 */
$(window).on('load', function() {
    let map = document.getElementById("nav_map")
    let offline = document.getElementById("offline_pic")
    if (navigator.onLine){
        map.setAttribute("style", "display:block;")
        offline.setAttribute("style", "display:none;")
    } else {
        offline.setAttribute("style", "display:block;")
        map.setAttribute("style", "display:none;")
    }
    readUserData()
});

/**
 * Called afrer reading username from indexDB
 * has been successfull
 * Initalizing all dynamic content on pages depending on username
 * @param {*} ev 
 */
const readUsernameSuccess = (ev) => {
    if (ev.target.result === undefined){
        console.error("There is no username in the database")
        document.getElementById("mine-link").classList.add("disabled")
        document.getElementById("mine_span").setAttribute("title","Must enter Username to view")
        $('#username-modal').modal('show'); //show modal

        //dissable the chat
        let chatInput = document.getElementById('chat_input')
        if (chatInput!== null) {
            chatInput.value = "Chat Disable, Set your username to use the chat"
            chatInput.disabled = true
        }
        
        let submitSighting = document.getElementById('g')
        if (submitSighting!== null) {
            submitSighting.value = "Need log in first"
            submitSighting.disabled = true
        }

    } else {
        document.getElementById("mine_span").setAttribute("title","")
        document.getElementById("mine-link").classList.remove("disabled")
        username = ev.target.result.data
        console.log("Username last stored:", username)
        document.getElementById('username_display').innerText = `Hello ${username}`
        document.getElementById('username').value = username
        document.getElementById('username_input').value = username //in change profile input
        if (document.getElementById('sightings_username')!== null)
            document.getElementById('sightings_username').value = username //for add page
        document.getElementById('mine-link').href = `/mine?username=${username}`
    }

}

/**
 * Called afrer reading location from indexDB
 * has been successfull
 * Initalizing all dynamic content on pages
 *  depending on  user location
 * @param {*} ev 
 */
const readLocationSuccess = (ev) => {
    if (ev.target.result === undefined){
        console.error("There is no location in the database")
        document.getElementById("nearby-link").classList.add("disabled")
        document.getElementById("nearby_span").setAttribute("title","Must enter Location to view")
        $('#username-modal').modal('show'); //show modal
    } else {
        document.getElementById("nearby-link").classList.remove("disabled")
        document.getElementById("nearby_span").setAttribute("title","")
        location = ev.target.result.data
        document.getElementById('loc').value = location
        console.log("Location last stored: ", location)
        document.getElementById('nearby-link').href = `/nearby?location=${location}`
    }

}

// success handler for opening db
const handleSuccess = () => {
    console.log("Successfully opened idexed db for nav")
    let save_btn = document.getElementById("saveUserData")
    save_btn.addEventListener("click", saveUserData)
}

/**
 * Saves user data to indexdb after
 * user submited form on "Change Profile" modal
 */
requestIDB = idb.connectToIDB(handleSuccess);
let saveUserData = () => {
    let username = document.getElementById('username_input').value
    let location = document.getElementById('user_location').value
    if(username)
        idb.saveValue('usernames',requestIDB,username)
    if(location)
        idb.saveValue('locations',requestIDB,location)

    readUserData()
}

/**
 * reads users ysername and location from IDB
 */
let readUserData = () => {
    idb.readValue('usernames',requestIDB, readUsernameSuccess,(ev) => {
        console.log("There was an error reading the username")
    })

    idb.readValue('locations',requestIDB, readLocationSuccess,(ev) => {
        console.log("There was an error reading the location")
    })
}

/**
 * Initialize map for change profile modal
 * Where user can input their location
 */
function initMapNav() {
    navMap = gMap.createMap("nav_map",true,[53.3811,-1.4701])
    navMap = gMap.addClickListener(navMap,'user_location',navMarker,true,"/images/user.png")
}

/**
 * registering service Worker
 */
navigator.serviceWorker.register("/serviceWorker.js", { type: 'module' }).then(
    (register) => {
        console.log(`Registered: ${register.scope}`)
    },
    (err) => {
        console.log(`Failed to register: ${err}`)
    });
window.initMapNav = initMapNav;

