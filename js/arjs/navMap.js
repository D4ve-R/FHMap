const map = new OSMBuildings({
	container: 'embedded-map',
	zoom: 18,
	minZoom: 18,
	maxZoom: 18,
	tilt: 40,
	rotation: 0,
	disabled: true,
	attribution: '© <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
});

map.addMapTiles('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

navigator.geolocation.watchPosition((pos) => {
		const {latitude, longitude} = pos.coords;
		map.setPosition(longitude, latitude);
	}, (err) => {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}, {
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: 10000
	}
);

