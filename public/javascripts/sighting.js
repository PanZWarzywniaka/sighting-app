import * as gMap from './map.js';

let map;
let marker;

function initMap() {
    let map_data = document.getElementById("location");
    let coords = map_data.dataset.loc.split(',');
    map = gMap.createMap("map",false,coords)
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(coords[1]),parseFloat(coords[0])),
        icon: "/images/bird.png",
        map: map
    });
    marker.setMap(map);
}

window.initMap = initMap;