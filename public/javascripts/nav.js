import * as idb from './indexedDB.js';
import * as gMap from "./map.js";
let username = null
let location;
let navMap;
let navMarker;
let requestIDB;

$(window).on('load', function() {
    readUserData()
});


const readUsernameSuccess = (ev) => {
    if (ev.target.result === undefined){
        console.error("There is no username in the database")
        document.getElementById("mine-link").classList.add("disabled")
        document.getElementById("mine_span").setAttribute("title","Must enter Username to view")
        $('#username-modal').modal('show'); //show modal
    } else {
        document.getElementById("mine_span").setAttribute("title","")
        document.getElementById("mine-link").classList.remove("disabled")
        username = ev.target.result.data
        console.log("Username last stored:", username)
        document.getElementById('username_display').innerText = `Hello ${username}`
        document.getElementById('username').value = username
        if (document.getElementById('sightings_username')!== null)
            document.getElementById('sightings_username').value = username //for add page
        document.getElementById('mine-link').href = `/mine?username=${username}`
    }

}
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
let readUserData = () => {
    idb.readValue('usernames',requestIDB, readUsernameSuccess,(ev) => {
        console.log("There was an error reading the username")
    })

    idb.readValue('locations',requestIDB, readLocationSuccess,(ev) => {
        console.log("There was an error reading the location")
    })
}

function initMapNav() {
    navMap = gMap.createMap("nav_map",true,[53.3811,-1.4701])
    navMap = gMap.addClickListener(navMap,'user_location',navMarker,true,"/images/user.png")
}
window.initMapNav = initMapNav;

