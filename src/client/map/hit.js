
const blue = '#0095ff';
const fhBlue = '#00b1ac';
const lila = '#ed2bea';
const green = '#03fc41';
const orange = '#e85e02';

const minZoom = 14;
const maxZoom = 19;
const zoom = 17;

const fhBaseCoords = [50.75913555311056, 6.082413196563721];

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
);

const divEl = document.getElementById('map');

const map = L.map('map', {
    center: fhBaseCoords,
    zoom: zoom,
    minZoom: minZoom,
    layers: osm,
});

const buildD = L.marker([50.760445, 6.083084], {title: 'Eupenerstr D'}).on('click', function(e){
	console.log('clicked');
}).addTo(map),
buildC = L.marker([50.758048, 6.08163], {title: 'Eupenerstr C'}).addTo(map),
buildW = L.marker([50.758397, 6.081096], {title: 'Eupenerstr W'}).addTo(map);

const route = getUrlParam('route');
if(route)
	routing(route, map);

