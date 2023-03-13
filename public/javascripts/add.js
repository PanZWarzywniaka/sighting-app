let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'),{disableDefaultUI: true});
    map.setZoom(15);
    // Get current users location, canter map to sheffield if error or user doesn't allow access to location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        }, function(err){
            map.setCenter(new google.maps.LatLng(53.3811,-1.4701));
        })
    } else {
        map.setCenter(new google.maps.LatLng(53.3811,-1.4701));
    }
    // Place marker where user clicks on map and store longitude and latitude in hidden input fields in the form
    map.addListener("click", (event) => {
        addMarker(event.latLng);
        document.getElementById('lng').value = `${event.latLng.lng()}`
        document.getElementById('lat').value = `${event.latLng.lat()}`
    });
}

// Adds a marker to the map
function addMarker(position) {
    // get rid of previous marker since user can only input 1 marker
    if (marker)
        marker.setMap(null);
    //create new marker
    marker = new google.maps.Marker({
        position,
        map,
    });
    //add marker to the map
    marker.setMap(map);
}

window.initMap = initMap;