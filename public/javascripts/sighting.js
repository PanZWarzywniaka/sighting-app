let map;

function initMap() {
    let map_data = document.getElementById("location");
    let coords = map_data.dataset.loc.split(',');
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(parseFloat(coords[1]),parseFloat(coords[0])),
        zoom: 16,
        disableDefaultUI: true
    });
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(coords[1]),parseFloat(coords[0])),
        icon: "/images/bird.png",
        map: map
    });
    marker.setMap(map);
}

window.initMap = initMap;