let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'),{
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
    // Place marker where user clicks on map and store longitude and latitude in hidden input fields in the form
    map.addListener("click", (event) => {
        addMarker(event.latLng);
        document.getElementById('location').value = `${event.latLng.lng()},${event.latLng.lat()}`;
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
        icon: "/images/bird.png",
        map,
    });
    //add marker to the map
    marker.setMap(map);
}

function onSubmit(event) {
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
    form.submit()

}

window.initMap = initMap;