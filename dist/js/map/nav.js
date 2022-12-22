
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
const div = document.getElementById('content');
const mapEl = document.getElementById('map');
const map = L.map(mapEl, {
    center: fhBaseCoords,
    zoom: zoom,
    minZoom: minZoom,
    layers: osm,
});

const polyOpts = {color: fhBlue, fillOpacity: 0.5, weight: 1};

const coords = {};
coords.loaded = false;

fetch('data/buildings.geojson').then(response => response.json()).then(data => {
	const features = data.features.filter(f => f.properties.name.startsWith("Eupenerstr."));
	for(let feature of features) {
		const id = feature.properties.id;
		const bounds = feature.properties.boundsGeometry.coordinates;
		const polygon = L.polygon(bounds, {...polyOpts, id: id}).addTo(map).on('click', function(e) {
			hideMap();
			showInfo(e.target.options.id);
		});
		coords[id] = {pos: feature.geometry.coordinates, id: id}
	}
	coords.loaded = true;
});

const router = new Router('data/campus.geojson');

const start = document.getElementById('start');
const select = document.getElementById('nav');
const h = document.createElement('h2');

let circle = null;

function navTargetSelect(nav) {
	if(circle) {
		map.removeLayer(circle);
	}

	if(!coords.loaded) {
		setTimeout(() => navTargetSelect(nav), 100);
		return;
	}
	h.innerHTML = 'Gebäude ';
	if(coords[nav]){
		h.innerHTML += coords[nav].id.toUpperCase();
		map.setView(coords[nav].pos, zoom);
		circle = L.circle(coords[nav].pos, 5, {color: red, fillOpacity: 0.5}).addTo(map);
	}
}

const hideMap = () => {
	div.style.display = 'block';
	mapEl.style.display = 'none'; 
};

function showInfo(id) {
	navTargetSelect(id);
	div.appendChild(h);
}

let nav = getUrlParam('nav');
let target = '';
if(nav){
	start.style.display = 'none';
	document.querySelector('label').style.display = 'none';
	showInfo(nav);
	for(let i = 0; i < select.options.length; i++) {
		let option = select.options[i];
		if(option.value === nav.toLowerCase()){
			option.disabled = true;
			break;
		}
	}
} 
else {
	start.addEventListener('change', function() {
		nav = this.value;
		showInfo(nav);
		if(path) {
			map.removeLayer(path);
		}
	});
}
const btn = document.getElementById('route');
btn.disabled = true;
let path = null;
select.addEventListener('change', async function(e){
	if(path) {
		map.removeLayer(path);
	}
	const route = await router.calculateRouteFromName(nav, this.value);
	const p = [];
	for(let i = route.path.length-1; i > 0; i--) {
		const line = L.polyline([route.path[i].pos, route.path[i-1].pos], {
			color: '#ff0000',
			weight: 3
		}).addTo(map);
		p.push(line);
		await new Promise(resolve => setTimeout(resolve, 150));
	}
	path = L.layerGroup(p).addTo(map);
	target = this.value;
	btn.disabled = false;
});

btn.addEventListener('click', function(){
	window.location.href = '/?route=' + nav +'-'+ target;
});
