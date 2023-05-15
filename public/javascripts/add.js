import * as gMap from './map.js';

let map;
let marker;


function initMap() {
    map = gMap.createMap("map")
    gMap.addClickListener(map,'location',marker,true,"/images/bird.png")
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