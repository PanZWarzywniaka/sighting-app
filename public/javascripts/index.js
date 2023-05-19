
/**
 * Creates a URL link for each sighting
 * @param {*} sightingId 
 */
function toSighting(sightingId){
    window.location.href = `/sightings/${sightingId}?username=${document.getElementById('username').value}`;
}
