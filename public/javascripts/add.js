import * as gMap from './map.js';
import * as idb from "./indexedDB.js";

let map;
let marker;

/**
 * Initializes map on /add page
 * User can click on the map 
 * to set location for a sighitng
 */
function initMap() {
    map = gMap.createMap("map",true,[53.3811,-1.4701])
    marker = gMap.addClickListener(map,'location',marker,true,"/images/bird.png")
}

let requestIDB = idb.connectToIDB(() => {
    console.log("connected to idb on add page")
});

/**
 * register sighting sync when user is offline
 * for later upload
 */
function registerSightingSync() {
    // only register sync when user offline

    let identification = document.getElementById('identification').value
    let description = document.getElementById('description').value
    let lastSeen = document.getElementById('last_seen').value
    let image = undefined
    // maybe say image is null?
    let username = document.getElementById('username').value
    let location = document.getElementById('location').value
    const sighting = {
        identification: identification,
        description: description,
        lastSeen: lastSeen,
        image: image,
        username: username,
        location: location
    };


    if(!navigator.onLine){
        // add current chat to indexedDB
        if(sighting){
            idb.saveValue("sightings",requestIDB,sighting)
        }
        console.log("Chat saved!")
        new Promise(function (resolve,reject) {
            Notification.requestPermission(function(result) {
                resolve();
            })
        }).then(function () {
            return navigator.serviceWorker.ready;
        }).then(function (reg) {
            try {
                return reg.sync.register("sighting_sync");

            } catch {
                console.log("Background sync failed !");
            }
        }).then(function () {
            console.info('Sighting sync registered');
        }).catch(function (err) {
            console.error(`Failed to register sighting sync ${err.message}`)
        });
    }

}

/**
 * Handles on submit form when user
 * wants to submit a new sighting
 * Validates the form
 */
function onSubmit(event) {
    registerSightingSync()
    event.preventDefault();
    let form = document.querySelector('#xForm');
    let last_seen = new Date(document.getElementById('last_seen').value);
    // splits location field into longitude and latitude
    let loc = document.getElementById('location').value.split(",");
    let identification = document.getElementById('identification').value;
    let description = document.getElementById('description').value;

    console.log(loc)
    console.log(loc.length)
    console.log(last_seen, typeof last_seen);
    let current_date = new Date();

    if(identification === "" || description === "") {
        alert('Please fill in the empty fields')
        return;
    }

    if(loc.length !== 2) {
        console.log('select a location in the map', loc, loc.length);
        alert('Please select a location from the map')
        return;
    }

    if(last_seen.getTime() > current_date.getTime() || isNaN(last_seen)) {
        alert('Please enter a valid date');
        return;
    }
    if(!navigator.onLine){
        //post to indexedDB
        window.location.replace("/offline");
    }
    else
        form.submit()

}

window.onSubmit = onSubmit;
window.initMap = initMap;

/**
 * Encodes images to base64
 */
function encode() {
    console.log("test");
    var selectedfile = document.getElementById("myImage").files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result;
        var newImage = document.createElement('img');
        newImage.src = srcData;
        document.getElementById("imgTest").innerHTML = newImage.outerHTML;
        alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
        console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
      }
      fileReader.readAsDataURL(imageFile);
    }
}