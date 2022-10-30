const maxZoom = 18;
const fhBaseCoords = [50.761409, 6.08767];

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
	minZoom: maxZoom,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
);


const map = L.map('embedded-map', {
	center: fhBaseCoords,
	zoom: maxZoom,
	layers: osm,
	zoomControl: false,
	boxZoom: false,
	scrollWheelZoom: false,
	doubleClickZoom: false,
	dragging: false,
	keyboard: false,
	touchZoom: false,
});

const osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

/**
 * device location tracking
 */

 map.locate({
	setView: true, 
	maxZoom: maxZoom,
	watch: true,
	enableHighAccuracy: true
});

let marker = null;

function success(e) {
	if(marker !== null)
		map.removeLayer(marker);
 
	marker = L.circle(e.latlng, {
		color: 'red',
		fillOpacity: 0.99,
		radius: 2
	}).addTo(map);
}
 
function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}

map.on('locationfound', success);
map.on('locationerror', error);

function onVisibilityChange() {
	map.stopLocate();
}

window.addEventListener('visibilitychange', () => { 
	onVisibilityChange();
	window.removeEventListener('visibilitychange', onVisibilityChange);
});