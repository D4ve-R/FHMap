//import fetchGeoJSON from './fetchGeoJSON.js';
// import getUrlParams from '../utils.js';

const blue = '#0095ff';
const fhBlue = '#00b1ac';
const lila = '#ed2bea';
const green = '#03fc41';
const orange = '#e85e02';

const minZoom = 12;
const maxZoom = 19;
const zoom = 14;

const fhBaseCoords = [50.761409, 6.08767];
const worldBounds = [[49, 5], [51, 5], [51, 7], [49, 7]];
const mapBounds = [[50.735, 6.038], [50.738, 6.177], [50.832, 6.169], [50.829, 6.035]]

const eupenerBounds = [
    [50.757677, 6.079721],
    [50.757382, 6.080875],
    [50.757328, 6.081698],
    [50.757587, 6.083192],
    [50.757480, 6.084449],
    [50.756855, 6.084390],
    [50.756852, 6.085352],
    [50.759035, 6.085497],
    [50.760201, 6.084714],
    [50.760631, 6.082829],
];

const bayernBounds = [
    [50.75563, 6.095068],
    [50.753906, 6.096656],
    [50.754461, 6.09805],
    [50.754809, 6.097731],
    [50.756249, 6.097629],
    [50.756533, 6.096833],
    [50.756268, 6.096554],
    [50.755942, 6.095996]
];

const baboBounds = [
    [50.764504, 6.077097],
    [50.765155, 6.07699],
    [50.765766, 6.077864],
    [50.765114, 6.080697],
    [50.763906, 6.081668],
    [50.763598, 6.080898], 
    [50.763621, 6.080286],
    [50.763774, 6.080294],
    [50.764022, 6.079675],
    [50.764285, 6.079919],
    [50.764375, 6.079903],
];

const boxGrabenBounds = [
	[50.76847335022682, 6.078202128410339],
	[50.769138325736684, 6.078051924705505],
	[50.769243499568944, 6.079038977622987],
	[50.76914511115235, 6.079902648925781],
	[50.76919260903448, 6.080272793769837],
	[50.768629416756596, 6.0804283618927]
];

const fhMask = L.polygon([worldBounds, eupenerBounds, bayernBounds, baboBounds, boxGrabenBounds], {
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

const osmb = new OSMBuildings().load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

const mensaIcon = L.divIcon({
    html: '<i class="fa fa-utensils"></i>',
    className: 'mensaIcon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const mensa0 = L.marker([50.759407, 6.082322], {icon: mensaIcon}).bindPopup('<b>Mensa Eupenerstr</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-eupener-strasse-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa1 = L.marker([50.757915, 6.081952], {icon: mensaIcon}).bindPopup('<b>Mensa Südpark</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Essen_und_Trinken/mensa-suedpark-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa2 = L.marker([50.755691, 6.097063], {icon: mensaIcon}).bindPopup('<b>Mensa Bayernallee</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-bayernallee-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa3 = L.marker([50.764799, 6.078159], {icon: mensaIcon}).bindPopup('<b>Mensa KMAC</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-goethestrasse-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');

const buildE = L.marker([50.759521, 6.082668]).bindPopup("<b>E</b>").on('click', (e) => {Swal.fire({title: 'Building E', html: '<div id="map"></div>'});}),
      buildD = L.marker([50.760445, 6.083084]).bindPopup("<b>D</b>"),
      buildF = L.marker([50.758912, 6.081351]).bindPopup("<b>F</b>"),
      buildC = L.marker([50.758048, 6.08163]).bindPopup("<b>C</b>"),
      buildG = L.marker([50.758835, 6.081898]).bindPopup("<b>G</b>"),
      buildH = L.marker([50.758761, 6.082601]).bindPopup("<b>H</b>"),
      buildW = L.marker([50.758397, 6.081096]).bindPopup("<b>W</b>"),
      buildB = L.marker([50.758002, 6.082545]).bindPopup("<b>B</b>");

const goe1 = L.marker([50.76374021576448, 6.08069121837616]).bindPopup('<b>Gebäude 1</b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik/gebaeude" target="_blank" rel="noopener">Info</a>'),
      goe2 = L.marker([50.76423730220888, 6.08057051897049]).bindPopup('<b>Gebäude 2</b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik/gebaeude" target="_blank" rel="noopener">Info</a>'),
      goe3 = L.marker([50.7643085564883, 6.080983579158784]).bindPopup('<b>Gebäude 3</b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik/gebaeude" target="_blank" rel="noopener">Info</a>'),
      goe4 = L.marker([50.764128724050664, 6.081270575523377]).bindPopup('<b>Gebäude 4</b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik/gebaeude" target="_blank" rel="noopener">Info</a>'),
      goe5 = L.marker([50.763987911376404, 6.079985797405244]).bindPopup('<b>Gebäude 5</b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik/gebaeude" target="_blank" rel="noopener">Info</a>');

const bay1 = L.marker([50.75527706020304, 6.096489429473878]).bindPopup('<b>Trakt 1</b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen/studium/gebaeude-bayernallee" target="_blank" rel="noopener">Info</a>'),
      bay2 = L.marker([50.754856237868154, 6.096816658973695]).bindPopup('<b>Trakt 2</b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen/studium/gebaeude-bayernallee" target="_blank" rel="noopener">Info</a>'),
      bay3 = L.marker([50.75443201797519, 6.09717607498169]).bindPopup('<b>Trakt 3</b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen/studium/gebaeude-bayernallee" target="_blank" rel="noopener">Info</a>'),
      bay4 = L.marker([50.75516846125302, 6.096982955932617]).bindPopup('<b>Trakt 4</b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen/studium/gebaeude-bayernallee" target="_blank" rel="noopener">Info</a>'),
      bay5 = L.marker([50.754798544188596, 6.0973745584487915]).bindPopup('<b>Trakt 5</b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen/studium/gebaeude-bayernallee" target="_blank" rel="noopener">Info</a>');

const box1 = L.marker([50.76883298101297, 6.079334020614625]).bindPopup('<b>Boxgraben</b><br/><a href="https://www.fh-aachen.de/fachbereiche/gestaltung/kontakt-und-anfahrt" target="_blank" rel="noopener">Info</a>')

const fsIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const fs1 = L.marker([50.75517694555507,6.096261441707611], {icon: fsIcon}).bindPopup('<b>FB01 Architektur</b><br/><a href="https://www.fh-aachen.de/fachbereiche/architektur" target="_blank" rel="noopener">Info</a>'),
      fs2 = L.marker([50.75485284412427, 6.096585988998414], {icon: fsIcon}).bindPopup('<b>FB02 Bauingenieurwesen</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/bauingenieurwesen" target="_blank" rel="noopener">Info</a>'),
      //fs3 = L.marker([50.758912, 6.081351]).bindPopup("FB03 Chemie & Biotech."),
      fs4 = L.marker([50.76873459173299, 6.0787439346313485], {icon: fsIcon}).bindPopup('<b>FB04 Gestaltung</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/gestaltung" target="_blank" rel="noopener">Info</a>'),
      fs5 = L.marker([50.7581395697898, 6.082625091075898], {icon: fsIcon}).bindPopup('<b>FB05 Elektro- & Informationstech.</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/elektrotechnik-und-informationstechnik" target="_blank" rel="noopener">Info</a>'),
      fs6 = L.marker([50.76487519379996, 6.079749763011932], {icon: fsIcon}).bindPopup('<b>FB06 Luft- & Raumfahrttech.</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/luft-und-raumfahrttechnik" target="_blank" rel="noopener">Info</a>'),
      fs7 = L.marker([50.75953088643949, 6.082909405231477], {icon: fsIcon}).bindPopup('<b>FB07 Wirtschaftswiss.</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/wirtschaft" target="_blank" rel="noopener">Info</a>'),
      fs8 = L.marker([50.76410157947173, 6.081096231937409], {icon: fsIcon}).bindPopup('<b>FB08 Maschinenbau & Mechatronik</b></b><br/><a href="https://www.fh-aachen.de/fachbereiche/maschinenbau-und-mechatronik" target="_blank" rel="noopener">Info</a>');

const rektorIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const rektor = L.marker([50.75559606816141,6.096009314060212], {icon: rektorIcon}).bindPopup('<b>Rektorat & Verwaltung</b><br/><a href="https://www.fh-aachen.de/hochschule/rektorat" target="_blank" rel="noopener">Info</a>');

const studentParking = L.polygon([
        [50.759296, 6.083616],
        [50.759886, 6.083803],
        [50.760137, 6.084340],
        [50.759880, 6.084899],
        [50.759380, 6.085059],
        [50.759017, 6.084959],
    ]
).bindPopup('<b>Student Parking</b><br/><small><a href="https://www.fh-aachen.de/hochschule/studierendensekretariat/parkausweis" target="_blank" rel="noopener">Parking Pass</a> required</small>');

const visitorParking = L.polygon([
        [50.759126, 6.082746],
        [50.758901, 6.082683],
        [50.758901, 6.082537],
        [50.759148, 6.082579]
    ], {color: lila}
).bindPopup("<b>Visitor Parking</b><br/><small>Parking Pass at <a href=" +  window.location.pathname 
    + "?lat=50.75934933893059&lng=6.08283162117"
    + ">Reception</a></small>");

const aseagUrl = 'href="https://aseag.de/fahrplanauskunft" target="_blank" rel="noopener"';
const bus0 = L.circle([50.758011, 6.085252], {color: orange}).bindPopup("<b>Ronheider Weg, H.1<b><br/><small>-> AC City<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus1 = L.circle([50.757364, 6.085035], {color: orange}).bindPopup("<b>Ronheider Weg, H.2<b><br/><small>-> AC Siegel<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus2 = L.circle([50.757627, 6.084363], {color: orange}).bindPopup("<b>Ronheider Weg, H.3<b><br/><small>-> Hangeweiher<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus3 = L.circle([50.757101, 6.084729], {color: orange}).bindPopup("<b>Ronheider Weg, H.4<b><br/><small>-> BE<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus4 = L.circle([50.755185, 6.095537], {color: orange}).bindPopup("<b>Bayernallee, H.2<b><br/><small>-> AC Siegel<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus5 = L.circle([50.755369, 6.095586], {color: orange}).bindPopup("<b>Bayernallee, H.1<b><br/><small>-> AC City<br/><a "+aseagUrl+">Aseag</a></small>");

const buildings = L.layerGroup([buildB, buildE, buildD, buildF, buildC, buildD, buildG, buildW, buildH, rektor, goe1, goe2, goe3, goe4, goe5, bay1, bay2, bay3, bay4, bay5, box1]);
const fs = L.layerGroup([fs1, fs2, fs4, fs5, fs6, fs7, fs8]);
const bus = L.layerGroup([bus0, bus1, bus2, bus3, bus4, bus5]);
const food = L.featureGroup([mensa0, mensa1, mensa2, mensa3]);
const parking = L.layerGroup([studentParking, visitorParking]);

const baseLayers = {
    "Map": osm,
    "Satellite": satellite
}

const overlays = {
    "FH Aachen": fhMask,
	"Faculties": fs,
	"Buildings": buildings,
    "Mensen": food,
    "Student Parking": studentParking,
    "Visitor Parking": visitorParking,
	"ÖPNV": bus,
	"3D": osmb
};

const map = L.map('map', {
    center: fhBaseCoords,
    zoom: zoom,
    minZoom: minZoom,
    maxBounds: worldBounds,
    layers: [osm, parking, food, bus, buildings, fs],
});

const layerControl = L.control.layers(baseLayers, overlays);
map.addControl(layerControl);

map.on('overlayadd', (e) => {  
    e.layer.openPopup(); 
});

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
L.easyButton('fa-crosshairs', (btn, map) => {
    if(!track) {
        btn.button.style.backgroundColor = fhBlue;
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
}, { position: 'bottomright' }).addTo(map);

/**
 * Add a marker at location
 *
 */

const copyToClip = () => {
	let text = document.getElementById('locationMarkerText');
	let tooltip = document.getElementById('tooltiptext');
	tooltip.style.visibility = 'visible';
	navigator.clipboard.writeText(text.innerHTML.trim());
	setTimeout(() => {
		tooltip.style.visibility = 'hidden';
	}, 650);
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
        `<div class="copy-container">
            <p id="locationMarkerText" style="overflow: hidden;" onclick="copyToClip()">
                ${link}
            </p>
            <button style="height: 22px; width: 22px; padding: 0;" onclick="copyToClip()">
                <i class="fa fa-plus"></i>
            </button>
			<span id="tooltiptext">Copied!</span>
        </div>
        `        
    ).openPopup();

    map.off('click', addHandler);
};

L.easyButton({ 
    position: 'bottomright', 
    states: [{
            stateName: 'add-inactive',
            icon: 'fa-plus',
            title: 'add',
            onClick: function(btn, map) {
                btn.button.style.backgroundColor = fhBlue;
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

/*
map.on('click', function(e) {
	const start = '50.75888443836034,6.085395812988282';
	const end = e.latlng.lat + ',' + e.latlng.lng;
	const mapboxKey = 'pk.eyJ1IjoiZGF2aWRyZWNoayIsImEiOiJjbDk3NGY2emYwY3FmM3JsbWxnMzRod25zIn0.Ox7P9Zuh_xrlCxAoD5HO3A';
	let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+start+';'+end+'?geometries=geojson&access_token=' + mapboxKey;
	//url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=pk.eyJ1IjoiZGF2aWRyZWNoayIsImEiOiJjbDk3NGY2emYwY3FmM3JsbWxnMzRod25zIn0.Ox7P9Zuh_xrlCxAoD5HO3A';
	fetch(url).then(res=>res.json()).then(data => {
		console.log(data.routes[0].geometry.coordinates);
		let route = L.polyline(data.routes[0].geometry.coordinates, {color: 'red'}).addTo(map);
		//map.fitBounds(route.getBounds());
	});
});
*/
