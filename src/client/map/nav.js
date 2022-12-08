
const red = '#ff0000';
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
const map = L.map('map', {
    center: fhBaseCoords,
    zoom: zoom,
    minZoom: minZoom,
    layers: osm,
});

const buildE = L.marker([50.759521, 6.082668], {title: 'Eupenerstr E'}).addTo(map),
    buildD = L.marker([50.760445, 6.083084], {title: 'Eupenerstr D'}).addTo(map),
    buildF = L.marker([50.758912, 6.081351], {title: 'Eupenerstr F'}).addTo(map),
    buildC = L.marker([50.758048, 6.08163], {title: 'Eupenerstr C'}).addTo(map),
    buildG = L.marker([50.758835, 6.081898], {title: 'Eupenerstr G'}).addTo(map),
    buildH = L.marker([50.758761, 6.082601], {title: 'Eupenerstr H'}).addTo(map),
    buildW = L.marker([50.758397, 6.081096], {title: 'Eupenerstr W'}).addTo(map),
    buildB = L.marker([50.758002, 6.082545], {title: 'Eupenerstr B'}).addTo(map);

const div = document.getElementById('content');
const start = document.getElementById('start');
const select = document.getElementById('nav');
const h = document.createElement('h2');

function navTargetSelect(nav) {
	h.innerHTML = 'Gebäude ';
	switch(nav){
		case 'b':
			map.setView(buildB.getLatLng(), zoom);
			map.addLayer(L.circle(buildB.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'B';
			break;
		case 'c':
			map.setView(buildC.getLatLng(), zoom);
			map.addLayer(L.circle(buildC.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'C';
			break;
		case 'd':
			map.setView(buildD.getLatLng(), zoom);
			map.addLayer(L.circle(buildD.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'D';
			break;
		case 'e':
			map.setView(buildE.getLatLng(), zoom);
			map.addLayer(L.circle(buildE.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'E';
			break;
		case 'f':
			map.setView(buildF.getLatLng(), zoom);
			map.addLayer(L.circle(buildF.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'F';
			break;
		case 'g':
			map.setView(buildG.getLatLng(), zoom);
			map.addLayer(L.circle(buildG.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'G';
			break;
		case 'h':
			map.setView(buildH.getLatLng(), zoom);
			map.addLayer(L.circle(buildH.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'H';
			break;
		case 'w':
			map.setView(buildW.getLatLng(), zoom);
			map.addLayer(L.circle(buildW.getLatLng(), 5, {color: red, fillOpacity: 0.5}));
			h.innerHTML += 'W';
			break;
	}
}

let nav = getUrlParam('nav');
let target = '';
if(nav){
	start.style.display = 'none';
	document.querySelector('label').style.display = 'none';

	navTargetSelect(nav);
	div.appendChild(h);
	for(let i = 0; i < select.options.length; i++) {
		let option = select.options[i];
		if(option.value === nav.toLowerCase())
			option.disabled = true;
	}
} 
else {
	start.addEventListener('change', function() {
		navTargetSelect(this.value);
		nav = this.value;
		div.appendChild(h);
	});
}

select.addEventListener('change', function(){
	routing(nav + this.value, map);
	target = this.value;
});

document.getElementById('route').addEventListener('click', function(){
	window.location.href = '/?route=' + nav + target;
});