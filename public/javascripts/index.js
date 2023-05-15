let username = null

$(window).on('load', function() {

    console.log("Page has been loaded!")
    readUserData()
});

const readUserDataSuccess = (ev) => {
    username = ev.target.result.text
    let location = ev.target.result.location
    console.log("Saved username: ", username)
    console.log("Saved location: ", location)
    document.getElementById('username_input').value = username //to have it in modal form
    document.getElementById('username_display').innerText = `Hello ${username}`
    let add_username = document.getElementById('sightings_username');
    if (add_username !== null)
        add_username.value = username //for add page

    hideUpdate();
    let nearByLink = document.getElementById('nearby-link')
    nearByLink.href = `/nearby?location=${location}`

    let mineLine = document.getElementById('mine-link')
    mineLine.href = `/mine?username=${username}`

}
function hideUpdate() {
    try {
        if (username !== document.getElementById('sightings_creator').value ) {
            //hide button for updating sighting if user didnt create it
            document.getElementById('update-id-button').hidden = "True" 
        }
    } catch (error) {
        //ignore errors on diffrent sights
    }
}

const handleSuccess = () => {
    console.log("Success")
    let save_btn = document.getElementById("saveUserData")
    save_btn.addEventListener("click", saveUserData)
}

const handleUpgrade = (ev) => {
    const db = ev.target.result
    console.log("Upgrading")
    db.createObjectStore("usernames", {keyPath: "id"})
}

const handleError = (err) => {
    console.error("Error: " + JSON.stringify(err)+"\n")
}


const requestIDB = indexedDB.open("db")
requestIDB.addEventListener("upgradeneeded", handleUpgrade)
requestIDB.addEventListener("success", handleSuccess)
requestIDB.addEventListener("error", handleError)

//saves username and location from modal
let saveUserData = () => {
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction(['usernames'], "readwrite")
    const myStore = transaction.objectStore('usernames')

    let username = document.getElementById('username_input').value
    let user_location = document.getElementById('user_location').value
    
    myStore.clear() //clear past data if exists
    myStore.add({id: 1, text: username, location: user_location})

    
    console.log("Username saved")
    readUserData()
}

let readUserData = () => {
    const myIDB = requestIDB.result
    const transaction = myIDB.transaction(['usernames'], "readwrite")
    const myStore = transaction.objectStore('usernames')

    let savedUsername = myStore.get(1) 
    savedUsername.addEventListener("success", readUserDataSuccess)

    savedUsername.addEventListener("error", (ev) => {
        console.error("There is no username in the database")
        $('#username-modal').modal('show'); //show modal
    })
}

function toSighting(sightingId){
    window.location.href = `/sightings/${sightingId}?username=${username}`;
}

//map for user
let userMap;
let userMarker;

function initUserMap() {
    console.log("Initializing user map")
    userMap = new google.maps.Map(document.getElementById('map'),{
        disableDefaultUI: true,
        mapTypeId: 'hybrid',
        zoomControl: true,
        zoom: 15,
    });
    // Get current users' location, center map to sheffield if error or user doesn't allow access to location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            userMap.setCenter(initialLocation);
        }, function(err){
            userMap.setCenter(new google.maps.LatLng(53.3811,-1.4701));
        })
    } else {
        userMap.setCenter(new google.maps.LatLng(53.3811,-1.4701));
    }
    // Place marker where user clicks on map and store longitude and latitude in hidden input fields in the form
    userMap.addListener("click", (event) => {
        addUserMarker(event.latLng);
        document.getElementById('user_location').value = `${event.latLng.lng()},${event.latLng.lat()}`;
    });
}

// Adds a marker to the map
function addUserMarker(position) {
    // get rid of previous marker since user can only input 1 marker
    if (userMarker)
        userMarker.setMap(null);
    //create new marker
    userMarker = new google.maps.Marker({
        position,
        icon: "/images/user.png",
        userMap,
    });
    //add marker to the map
    userMarker.setMap(userMap);
}
window.initUserMap = initUserMap;