/**
 * Helper to inialize map using Google Maps API
 * @param {*} mapId div element when map will be displayed 
 * @param {boolean} useUserLoc should we use users GPS location
 * @param {*} loc longitude and lattidue of the marker
 * @returns 
 */
function createMap(mapId, useUserLoc, loc) {
    let map = new google.maps.Map(document.getElementById(mapId),{
        disableDefaultUI: true,
        mapTypeId: 'hybrid',
        zoomControl: true,
        zoom: 15,
    });
    // Get current users' location, center map to sheffield if error or user doesn't allow access to location
    if(useUserLoc){
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
    } else {
        map.setCenter(new google.maps.LatLng(parseFloat(loc[1]),parseFloat(loc[0])));
    }

    return map
}

/**
 * Add click listeber to map
 * @param {*} map div element
 * @param {*} locationStoreElement 
 * @param {*} marker 
 * @param {*} canAddMarker 
 * @param {*} iconPath what Icon to use
 * @returns 
 */
function addClickListener(map,locationStoreElement,marker,canAddMarker,iconPath){
    // Place marker where user clicks on map and store longitude and latitude in hidden input fields in the form
    map.addListener("click", (event) => {
        marker = addMarker(event.latLng,map,marker,canAddMarker,iconPath);
        document.getElementById(locationStoreElement).value = `${event.latLng.lng()},${event.latLng.lat()}`;
    });
    return marker
}


/**
 * Adds new marker on the map
 * @param {*} position to be marked on map
 * @param {*} map map element
 * @param {*} marker existing marker
 * @param {boolean} canAddMarker can user add new marker
 * @param {*} iconPath path for marker icon
 * @returns new marker for the map
 */
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
    return marker
}


export { createMap, addClickListener };