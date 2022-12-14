
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

const B = L.polygon([
	[50.75845855823727, 6.082579493522645],
	[50.75842292665686, 6.082799434661866],
	[50.757795127694976, 6.08256608247757],
	[50.7578188824036, 6.082413196563721],
	[50.75777985680448, 6.082399785518647],
	[50.757790037398706, 6.082332730293275]
], {...polyOpts, id: 'b'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const C = L.polygon([
	[50.75765090241951, 6.081179380416871],
	[50.75830754801984, 6.081426143646241],
	[50.758280400063924, 6.081635355949403],
	[50.75817180808273, 6.0815924406051645],
	[50.75804794504654, 6.082423925399781],
	[50.75783585004521, 6.082343459129334],
	[50.757862998259036, 6.082158386707307],
	[50.7578188824036, 6.0821396112442025],
	[50.7578816626469, 6.081702411174775],
	[50.757927475203715, 6.081723868846894],
	[50.7579563201239, 6.081517338752747],
	[50.75761866376776, 6.081393957138062]
], {...polyOpts, id: 'c'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const D = L.polygon([
	[50.76008909819957, 6.0827887058258066],
	[50.760516660150714, 6.0829496383667],
	[50.760475940133205, 6.0832151770591745],
	[50.76005007449362, 6.083051562309266],
], {...polyOpts, id: 'd'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const E = L.polygon([
	[50.75965304885278, 6.082144975662232],
	[50.75961402478321, 6.082453429698945],
	[50.75967340922401, 6.082619726657868],
	[50.75993639655601, 6.08271360397339],
	[50.7599007661008, 6.083011329174043],
	[50.75970055637184, 6.082936227321625],
	[50.759649655456734, 6.082979142665863],
	[50.7595699105784, 6.083507537841798],
	[50.759386666513315, 6.083440482616425],
	[50.759468108408605, 6.0828155279159555],
	[50.75942738747865, 6.082799434661866],
	[50.75940702700041, 6.082936227321625],
	[50.75928995407853, 6.0828933119773865],
	[50.75931710144882, 6.082697510719299],
	[50.75939515005068, 6.0827189683914185],
	[50.75940533029349, 6.082651913166046],
	[50.759004905739765, 6.082512438297273],
	[50.75904562703731, 6.082287132740022],
	[50.75933067512807, 6.082378327846528],
	[50.75934933893059, 6.082254946231843],
	[50.759408723707274, 6.082206666469575],
	[50.759491862268014, 6.082241535186768],
	[50.75951391941241, 6.082112789154054]
], {...polyOpts, id: 'e'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const G = L.polygon([
	[50.75891497941546, 6.08170509338379],
	[50.75878602815827, 6.081662178039552],
	[50.75869610141339, 6.0822898149490365],
	[50.75882505291833, 6.082332730293275],
], {...polyOpts, id: 'g'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const H = L.polygon([
	[50.758713068736974, 6.082402467727662],
	[50.75872494585983, 6.082453429698945],
	[50.75880808563536, 6.082407832145692],
	[50.758867471098895, 6.082681417465211],
	[50.75868592101629, 6.082783341407776],
	[50.7586570765458, 6.082670688629151],
	[50.75861126470319, 6.082697510719299],
	[50.758563756078296, 6.082485616207124]
], {...polyOpts, id: 'h'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const F = L.polygon([
	[50.75897097129804, 6.081302762031555],
	[50.75893024993553, 6.0815924406051645],
	[50.75875039682722, 6.081522703170777],
	[50.75879281507541, 6.081238389015198],
], {...polyOpts, id: 'f'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const W = L.polygon([
	[50.75874530663483, 6.081136465072633],
	[50.758713068736974, 6.081351041793824],
	[50.75804794504654, 6.081104278564453],
	[50.758080183402576, 6.0808923840522775],
], {...polyOpts, id: 'w'}).addTo(map).on('click', function(e) {
	hideMap();
	showInfo(e.target.options.id);
});

const buildE = L.marker([50.759521, 6.082668], {title: 'Eupenerstr E'}),
    buildD = L.marker([50.760445, 6.083084], {title: 'Eupenerstr D'}),
    buildF = L.marker([50.758912, 6.081351], {title: 'Eupenerstr F'}),
    buildC = L.marker([50.758048, 6.08163], {title: 'Eupenerstr C'}),
    buildG = L.marker([50.758835, 6.081898], {title: 'Eupenerstr G'}),
    buildH = L.marker([50.758761, 6.082601], {title: 'Eupenerstr H'}),
    buildW = L.marker([50.758397, 6.081096], {title: 'Eupenerstr W'}),
    buildB = L.marker([50.758002, 6.082545], {title: 'Eupenerstr B'});

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
		if(option.value === nav.toLowerCase())
			option.disabled = true;
	}
} 
else {
	start.addEventListener('change', function() {
		nav = this.value;
		showInfo(nav);
	});
}

select.addEventListener('change', function(){
	routing(nav + this.value, map);
	target = this.value;
});

document.getElementById('route').addEventListener('click', function(){
	window.location.href = '/?route=' + nav + target;
});