const minZoom = 14;
const maxZoom = 19;
const zoom = minZoom;

const fhMask = L.polygon([worldBounds, eupenerBounds, bayernBounds, baboBounds], {
    color: 'black', 
    fillOpacity: 0.8,
    renderer: L.svg({padding: 1})
});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
);

const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const satellite = L.tileLayer(satelliteUrl, {
    maxZoom: maxZoom - 1,
    attribution: '&copy; <a href="https://www.esri.com/legal/copyright-trademarks">Esri</a>'
});

function createMarker(feature) {
    return L.marker([feature.coords.lat, feature.coords.lng]).bindPopup("Building " + feature.name);
}

function fetchMarkers(url) {
    const markers = [];
    try {
        fetch(url).then(res => res.json()).then(json => {
            json.forEach(item => {
                markers.push(createMarker(item));
            });

        });
    } catch(err) { console.error(err); }

	return markers;
}

function fetchGeoJSON(url) {
    try {
        fetch(url).then(res => res.json()).then(json => {
            return json;
        });
    } catch(err) { console.error(err); }
}

const buildings = L.layerGroup(fetchMarkers('data/buildings.json'));
const bus = L.layerGroup([bus0, bus1, bus2, bus3, bus4, bus5]);
const food = L.featureGroup([mensa0, mensa1, mensa2, mensa3]);
const parking = L.layerGroup([studentParking, visitorParking]);

const baseLayers = {
    "Map": osm,
    "Satellite": satellite
}

const overlays = {
    "FH Aachen": fhMask,
    "Food": food,
    "Student Parking": studentParking,
    "Visitor Parking": visitorParking,
    "ÖPNV/PT": bus,
    "Buildings": buildings
};

const map = L.map('map', {
    center: fhBaseCoords,
    zoom: zoom,
    minZoom: minZoom,
    maxBounds: mapBounds,
    layers: [osm, parking, food, bus],
});

const layerControl = L.control.layers(baseLayers, overlays);
map.addControl(layerControl);

map.on('overlayadd', (e) => {  
    e.layer.openPopup(); 
});

const search = new L.Control.Search({
    layer: buildings,
    position: 'topcenter',
    collapsed: false
});

map.addControl(search);

/**
 * device location tracking
 */

let marker = null;

function success(pos) {
    if(marker != null)
        map.removeLayer(marker);

    marker = L.circle([pos.coords.latitude, pos.coords.longitude], {
        color: 'red',
        fillOpacity: 0.99,
        radius: 3
    }).addTo(map);

    map.setView([pos.coords.latitude, pos.coords.longitude], map.getMaxZoom() - 1);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

let track = false;
let handlerId = 0;
L.easyButton('fa-crosshairs fa-lg', (btn, map) => {
    if(!track) {
        btn.button.style.backgroundColor = blue;
        navigator.geolocation.getCurrentPosition(success, error, options);
        handlerId = navigator.geolocation.watchPosition(success, error, options);
        track = true;
    }
    else {
        btn.button.style.backgroundColor = 'white';
        navigator.geolocation.clearWatch(handlerId);
        // map.removeLayer(marker);
        // marker.remove();
        track = false;
    }
}).addTo(map);

/**
 * Add a marker at location
 *
 */

const copyToClip = () => {
let text = document.getElementById('locationMarkerText');
navigator.clipboard.writeText(text.innerHTML);
};

const locationMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.2/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -40],
    shadowSize: [41, 41]
});

const locationMarker = L.marker([], {
    icon: locationMarkerIcon,
});

const addHandler = (e) => {
    L.DomUtil.removeClass(map.getContainer(), 'leaflet-crosshair');
    L.DomUtil.removeClass(map.getContainer(), 'leaflet-interactive');
    L.DomUtil.addClass(map.getContainer(), 'leaflet-grab');
    locationMarker.setLatLng(e.latlng).addTo(map);
    locationMarker._draggable = true;
    let link = window.location.protocol + "//" 
        + window.location.host 
        + window.location.pathname 
        + '?lat=' + e.latlng.lat + '&amp;lng=' + e.latlng.lng;
    locationMarker.bindPopup(
        `<div style="display: flex; padding: 0.5rem; background-color: #ccc; border-radius: 1rem;">
            <p id="locationMarkerText" style="overflow: hidden;" onclick="copyToClip()">
                ${link}
            </p>
            <button style="height: 22px; width: 22px;" onclick="copyToClip()">
                <i class="fa-solid fa-clipboard fa-lg"></i>
            </button>
        </div>
        `        
    ).openPopup();

    map.off('click', addHandler);
};

L.easyButton({ 
    position: 'topright', 
    states: [{
            stateName: 'add-inactive',
            icon: 'fa-plus',
            title: 'add',
            onClick: function(btn, map) {
                btn.button.style.backgroundColor = blue;
                L.DomUtil.removeClass(map.getContainer(), 'leaflet-grab');
                L.DomUtil.addClass(map.getContainer(), 'leaflet-crosshair');
                L.DomUtil.addClass(map.getContainer(), 'leaflet-interactive');
                map.on('click', addHandler);
                btn.state('add-active');
            }
        }, 
        {
            stateName: 'add-active',
            icon: 'fa-plus',
            title: 'add',
            onClick: function(btn, map) {
                btn.button.style.backgroundColor = 'white';
                L.DomUtil.removeClass(map.getContainer(), 'leaflet-crosshair');
                L.DomUtil.removeClass(map.getContainer(), 'leaflet-interactive');
                L.DomUtil.addClass(map.getContainer(), 'leaflet-grab');
                locationMarker.remove();
                map.off('click', addHandler);
                btn.state('add-inactive');
            }
        }
    ]
}).addTo(map);

/**
 * AR Button
 */

L.easyButton('fa-globe', function(btn, map) {
    window.location.href = window.location.protocol + "//" 
        + window.location.host
        + window.location.pathname
        + "ar.html"
}, { position: 'bottomleft' }).addTo(map);


/**
 * Read locationMarker position from url params
 */

function getUrlParam(name){
    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

const targetMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.2/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -40],
    shadowSize: [41, 41]
});

const lat = getUrlParam('lat');
const lng = getUrlParam('lng');

if(lat != undefined && lng != undefined)
{
    L.marker([lat, lng], {
        icon: targetMarkerIcon,
    }).addTo(map);

    map.removeLayer(fhMask);
    map.removeLayer(buildings);
    map.setView([lat, lng], map.getMaxZoom() - 1);
}
