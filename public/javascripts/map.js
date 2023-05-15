function createMap(mapId) {
    let map = new google.maps.Map(document.getElementById(mapId),{
        disableDefaultUI: true,
        mapTypeId: 'hybrid',
        zoomControl: true,
        zoom: 15,
    });
    // Get current users' location, center map to sheffield if error or user doesn't allow access to location
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
    return map
}

function addClickListener(map,locationStoreElement,marker,canAddMarker,iconPath){
    // Place marker where user clicks on map and store longitude and latitude in hidden input fields in the form
    map.addListener("click", (event) => {
        addMarker(event.latLng,map,marker,canAddMarker,iconPath);
        document.getElementById(locationStoreElement).value = `${event.latLng.lng()},${event.latLng.lat()}`;
    });
}


// Adds a marker to the map
function addMarker(position,map,marker,canAddMarker,iconPath) {
    if(canAddMarker){
        // get rid of previous marker since user can only input 1 marker
        if (marker)
            marker.setMap(null);
        //create new marker
        marker = new google.maps.Marker({
            position,
            icon: iconPath,
            map,
        });
        //add marker to the map
        //"/images/bird.png"
        marker.setMap(map);
    }
}


export { createMap, addClickListener };