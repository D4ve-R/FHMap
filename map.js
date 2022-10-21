const lila = '#ed2bea';
const green = '#03fc41';
const orange = '#e85e02';

const fhBaseCoords = [50.759075, 6.082935];
const worldBounds = [[90, 180], [90, -180], [-90, -180], [-90, 180]];

const maxBounds = [
    [50.757377, 6.079721],
    [50.756852, 6.085352],
    [50.760445, 6.085759],
    [50.760754, 6.082779],
];

const fhBounds = [
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

const mask = L.polygon([worldBounds, fhBounds], {
    color: 'black', 
    fillOpacity: 0.8,
    renderer: L.svg({padding: 1})
});


const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
);

const mensaIcon = L.divIcon({
    html: '<i class="fa fa-utensils fa-lg"></i>',
    className: 'mensaIcon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const mensa0 = L.marker([50.759407, 6.082322], {icon: mensaIcon}).bindPopup('<b>Mensa Eupenerstr</b><br/><small><a href="https://www.studierendenwerk-aachen.de/de/Gastronomie/mensa-eupener-strasse-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');
const mensa1 = L.marker([50.757915, 6.081952], {icon: mensaIcon}).bindPopup('<b>Mensa Südpark</b><br/><small><a href="https://www.studierendenwerk-aachen.de/de/Essen_und_Trinken/mensa-suedpark-wochenplan.html" target="_blank" rel="noopener">Menu</a></small>');

const buildE = L.marker([0,0]).bindPopup("Building E"),
      buildD = L.marker([0,0]).bindPopup("Building D"),
      buildF = L.marker([0,0]).bindPopup("Building F"),
      buildC = L.marker([0,0]).bindPopup("Building C");

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
const bus0 = L.circle([50.758061, 6.085252], {color: orange}).bindPopup("<b>Ronheider Weg, H.1<b><br/><small>-> AC City<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus1 = L.circle([50.757401, 6.085041], {color: orange}).bindPopup("<b>Ronheider Weg, H.2<b><br/><small>-> AC Siegel<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus2 = L.circle([50.757662, 6.084355], {color: orange}).bindPopup("<b>Ronheider Weg, H.3<b><br/><small>-> Hangeweiher<br/><a "+aseagUrl+">Aseag</a></small>"),
      bus3 = L.circle([50.757109, 6.084742], {color: orange}).bindPopup("<b>Ronheider Weg, H.4<b><br/><small>-> BE<br/><a "+aseagUrl+">Aseag</a></small>");

const buildings = L.layerGroup([buildE, buildD, buildF, buildC]);
const bus = L.layerGroup([bus0, bus1, bus2, bus3]);
const food = L.featureGroup([mensa0, mensa1]);
const parking = L.layerGroup([studentParking, visitorParking]);

const overlays = {
    "FH Aachen": mask,
    "Food": food,
    "Student Parking": studentParking,
    "Visitor Parking": visitorParking,
    "ÖPNV/PT": bus
};

const map = L.map('map', {
    //center: fhBaseCoords,
    zoom: 17,
    minZoom: 16,
    maxBounds: maxBounds,
    layers: [osm, mask, parking, food, bus]
}).fitBounds(maxBounds);

const layerControl = L.control.layers({}, overlays, {collapsed: false}).addTo(map);

map.on('overlayadd', (e) => {  
    e.layer.openPopup(); 
});

var marker = null;

const setLocationMarker = (pos) => { 
    marker = L.circle([pos.coords.latitude, pos.coords.longitude], {
        color: 'red',
        radius: 3
    }).addTo(map);
}

function success(pos) {
    if(marker != null)
        map.removeLayer(marker);

    setLocationMarker(pos);
    map.setView([pos.coords.latitude, pos.coords.longitude], map.getMinZoom() + 1);
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


