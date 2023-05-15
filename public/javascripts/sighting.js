import * as gMap from './map.js';

let map;
let marker;

function initMap() {
    map = gMap.createMap("map")
    gMap.addClickListener(map,'location',marker,false,"/images/bird.png")
}

window.initMap = initMap;