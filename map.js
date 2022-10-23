const lila = '#ed2bea';
const green = '#03fc41';
const orange = '#e85e02';

const fhBaseCoords = [50.761409, 6.08767];
const worldBounds = [[49, 5], [51, 5], [51, 7], [49, 7]];
const mapBounds = [[50.735, 6.038], [50.738, 6.177], [50.805, 6.170], [50.808, 6.04]]

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

const fhMask = L.polygon([worldBounds, eupenerBounds, bayernBounds, baboBounds], {
    color: 'black', 
    fillOpacity: 0.8,
    renderer: L.svg({padding: 1})
});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
);

const satelliteAttr = '&copy; <a href="https://www.esri.com/legal/copyright-trademarks">Esri</a>';
const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const satellite = L.tileLayer(satelliteUrl, {attribution: satelliteAttr});

const mensaIcon = L.divIcon({
    html: '<i class="fa fa-utensils fa-lg"></i>',
    className: 'mensaIcon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const mensa0 = L.marker([50.759407, 6.082322], {icon: mensaIcon}).bindPopup('<b>Mensa Eupenerstr</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-eupener-strasse-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa1 = L.marker([50.757915, 6.081952], {icon: mensaIcon}).bindPopup('<b>Mensa Südpark</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Essen_und_Trinken/mensa-suedpark-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa2 = L.marker([50.755691, 6.097063], {icon: mensaIcon}).bindPopup('<b>Mensa Bayernallee</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-bayernallee-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa3 = L.marker([50.764799, 6.078159], {icon: mensaIcon}).bindPopup('<b>Mensa KMAC</b><br/><small><a href="https://www.studierendenwerk-aachen.de/Gastronomie/mensa-goethestrasse-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');

const buildE = L.marker([50.759521, 6.082668]).bindPopup("Building E").on('click', (e) => {Swal.fire({title: 'Building E', html: '<div id="map"></div>'});}),
      buildD = L.marker([50.760445, 6.083084]).bindPopup("Building D"),
      buildF = L.marker([50.758912, 6.081351]).bindPopup("Building F"),
      buildC = L.marker([50.758048, 6.08163]).bindPopup("Building C");
      buildG = L.marker([50.758835, 6.081898]).bindPopup("Building G");
      buildH = L.marker([50.758761, 6.082601]).bindPopup("Building H");
      buildW = L.marker([50.758397, 6.081096]).bindPopup("Building W");
      buildB = L.marker([50.758002, 6.082545]).bindPopup("Building B");

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
).bindPopup("<b>Visitor Parking</b><br/><small>Parking Pass at Reception</small>");

const aseagUrl = 'href="https://aseag.de/fahrplanauskunft" target="_blank" rel="noopener"';
const bus0 = L.circle([50.758011, 6.085252], {color: orange}).bindPopup("<b>Ronheider Weg, H.1<b><br/><small>-> AC City<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus1 = L.circle([50.757364, 6.085035], {color: orange}).bindPopup("<b>Ronheider Weg, H.2<b><br/><small>-> AC Siegel<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus2 = L.circle([50.757627, 6.084363], {color: orange}).bindPopup("<b>Ronheider Weg, H.3<b><br/><small>-> Hangeweiher<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus3 = L.circle([50.757101, 6.084729], {color: orange}).bindPopup("<b>Ronheider Weg, H.4<b><br/><small>-> BE<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus4 = L.circle([50.755185, 6.095537], {color: orange}).bindPopup("<b>Bayernallee, H.2<b><br/><small>-> AC Siegel<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus5 = L.circle([50.755369, 6.095586], {color: orange}).bindPopup("<b>Bayernallee, H.1<b><br/><small>-> AC City<br/><a "+aseagUrl+">Aseag</a></small>");

const buildings = L.layerGroup([buildB, buildE, buildD, buildF, buildC, buildD, buildG, buildW, buildH]);
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
    zoom: 15,
    minZoom: 14,
    maxBounds: mapBounds,
    layers: [osm, fhMask, parking, food, bus]
});

const layerControl = L.control.layers(baseLayers, overlays).addTo(map);

map.on('overlayadd', (e) => {  
    e.layer.openPopup(); 
});

var marker = null;

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

L.easyButton('fa-crosshairs fa-lg', (btn, map) => {
    navigator.geolocation.getCurrentPosition(success, error, options);
    navigator.geolocation.watchPosition(success, error, options);
}).addTo(map);

