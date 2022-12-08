const wayPoints = [
	{id: 0, pos: [50.76022313589829, 6.08319103717804], adj: [1]}, // D
	{id: 1, pos: [50.760022927548526, 6.083132028579712], adj: [0, 2, 21]},
	{id: 2, pos: [50.76007722142296, 6.082751154899598], adj: [1, 3]},
	{id: 3, pos: [50.76005177117715, 6.082635819911958], adj: [2, 4]},
	{id: 4, pos: [50.75982441503403, 6.082386374473573], adj: [3, 5]},
	{id: 5, pos: [50.7596411719655, 6.082069873809815], adj: [4, 6]},
	{id: 6, pos: [50.759313708028394, 6.081823110580444], adj: [5, 7]},
	{id: 7, pos: [50.75906768439201, 6.081734597682953], adj: [6, 8]},
	{id: 8, pos: [50.758965881129676, 6.081726551055909], adj: [7, 9]},
	{id: 9, pos: [50.758920069589365, 6.081675589084626], adj: [8, 10]},
	{id: 10, pos: [50.75872155239645, 6.081597805023194], adj: [9, 16]}, // tmp node FG
	{id: 11, pos: [50.75845686149598, 6.0817426443099984], adj: [10, 12, 39]}, // tmp Node CF
	{id: 12, pos: [50.75844328756329, 6.081517338752747], adj: [11, 13, 17]}, // tmp node W
	{id: 13, pos: [50.758484009349544, 6.081275939941407], adj: [12]}, // W
	{id: 14, pos: [50.75867404388353, 6.08195185661316], adj: [10, 15, 39]}, // tmp node G
	{id: 15, pos: [50.75873682297966, 6.081967949867249], adj: [14]}, // G
	{id: 16, pos: [50.758758880479924, 6.081375181674958], adj: [10]}, //F
	{id: 17, pos: [50.75842122991425, 6.081407368183136], adj: [12, 18]},
	{id: 18, pos: [50.75839238528064, 6.0813456773757935], adj: [17, 19]},
	{id: 19, pos: [50.7580852736673, 6.081238389015198], adj: [18, 20]},  // tmp Node CW2
	{id: 20, pos: [50.75807509313732, 6.08133763074875], adj: [19]}, //C
	{id: 21, pos: [50.759948273368366, 6.0836631059646615], adj: [1, 22]},
	{id: 22, pos: [50.75987531575905, 6.083765029907227], adj: [21, 23]},
	{id: 23, pos: [50.759746367148104, 6.083765029907227], adj: [22, 24]},
	{id: 24, pos: [50.75924244614264, 6.083598732948304], adj: [23, 25]},
	{id: 25, pos: [50.75931031460774, 6.083059608936311], adj: [24, 26]},
	{id: 26, pos: [50.75926789682859, 6.082930862903596], adj: [25, 27]}, // E
	{id: 27, pos: [50.75916779071738, 6.082799434661866], adj: [26, 28]},
	{id: 28, pos: [50.75907107783027, 6.082721650600433], adj: [27, 29]},
	{id: 29, pos: [50.758965881129676, 6.08267605304718], adj: [28, 30]}, // visitor parking
	{id: 30, pos: [50.758898012165055, 6.082700192928315], adj: [29, 31]},
	{id: 31, pos: [50.758891225263184, 6.082759201526643], adj: [30, 32]},
	{id: 32, pos: [50.75871476546898, 6.082877218723298], adj: [31, 33]},
	{id: 33, pos: [50.758631625527656, 6.082861125469209], adj: [32, 34]},
	{id: 34, pos: [50.75858920713333, 6.082823574543], adj: [33, 35]},
	{id: 35, pos: [50.75856884629042, 6.082635819911958], adj: [34, 36]}, // H
	{id: 36, pos: [50.75851964088344, 6.082558035850526], adj: [35, 37, 38]}, // tmp node HB
	{id: 37, pos: [50.75844668104684, 6.0826894640922555], adj: [36]}, // B
	{id: 38, pos: [50.758470435424705, 6.081874072551728], adj: [36, 39]},
	{id: 39, pos: [50.758470435424705, 6.081874072551728], adj: [11, 14, 38]}, // tmp Node CG
	{id: 40, pos: [50.75854678870059, 6.082477569580078], adj: [36, 41]},
	{id: 41, pos: [50.75861126470319, 6.082389056682587], adj: [14, 40]}
];

const d = wayPoints.slice(0, 11).map(p => p.pos);

const dw = [ ...d,
	...wayPoints.slice(11, 14).map(p => p.pos)
];

const dg =  [ ...d,
	...wayPoints.slice(14, 16).map(p => p.pos)
];

const df =  [ ...d,
	wayPoints[16].pos
];

const dc = [ ...dw.slice(0, -1),
	...wayPoints.slice(17, 21).map(p => p.pos)
];

const de = [ ...d.slice(0, 2),
	...wayPoints.slice(21, 27).map(p => p.pos)
];

const eh = [ ...de.slice(-1),
	...wayPoints.slice(27, 36).map(p => p.pos)
];

const eb = [ ...eh,
	wayPoints[36].pos,
	wayPoints[37].pos
]

const dh = [
	...de,
	...eh
]; 

const db = [ ...dh,
	wayPoints[36].pos,
	wayPoints[37].pos
];

const ew = [ ...eh,
	wayPoints[36].pos,
	wayPoints[39].pos,
	wayPoints[11].pos,
	...dw.slice(-2)
];

const ec = [
	...ew.slice(0, -1),
	...dc.slice(-4)
];

const eg = [
	...ew.slice(0, -3),
	...dg.slice(-1)
];

const ef = [ ...ew.slice(0, -2),
	wayPoints[11].pos,
	...df.slice(-2)
]; 

const hg = [
	wayPoints[35].pos,
	...wayPoints.slice(-2).map(p => p.pos),
	...wayPoints.slice(14, 16).map(p => p.pos)
];

const hf = [ ...hg.slice(0, -1),
	wayPoints[16].pos
];

const hw = [
	...ew.slice(-6),
];

const hc = [
	...hw.slice(0, -1),
	...dc.slice(-4)
];

const hb = wayPoints.slice(35, 38).map(p => p.pos);

const gf = [
	wayPoints[15].pos,
	wayPoints[14].pos,
	wayPoints[16].pos
];

const gw = [
	wayPoints[15].pos,
	wayPoints[14].pos,
	wayPoints[39].pos,
	...ew.slice(-4)
];

const gc = [
	...gw.slice(0, -1),
	...dc.slice(-4)
];

const gb = [
	...gw.slice(0, 3),
	wayPoints[36].pos,
	wayPoints[37].pos
];

const fw = [
	wayPoints[16].pos,
	wayPoints[10].pos,
	...dw.slice(-4)
];

const fc = [
	...fw.slice(0, -1),
	...dc.slice(-4)
];

const fb = [
	...gf.slice(-1),
	...gb.slice(1)
];

const wc = [
	wayPoints[13].pos,
	wayPoints[12].pos,
	...dc.slice(-4)
];

const wb = [
	...wc.slice(0,2),
	...fb.slice(2)
];


function routing(route, map){
	const routeOpts = {
		color: '#00b1ac',
		weight: 5,
	}
	if(route) {
		let result = null;
		switch(route) {
			case 'ed':
			case 'de':
				result = L.polyline(de, routeOpts).addTo(map);
				break;
			case 'wd':
			case 'dw':
				result = L.polyline(dw, routeOpts).addTo(map);
				break;
			case 'fd':
			case 'df':
				result = L.polyline(df, routeOpts).addTo(map);
				break;
			case 'gd':
			case 'dg':
				result = L.polyline(dg, routeOpts).addTo(map);
				break;
			case 'cd':
			case 'dc':
				result = L.polyline(dc, routeOpts).addTo(map);
				break;
			case 'dh':
			case 'hd':
				result = L.polyline(dh, routeOpts).addTo(map);
				break;
			case 'db':
			case 'bd':
				result = L.polyline(db, routeOpts).addTo(map);
				break;
			case 'eh':
			case 'he':
				result = L.polyline(eh, routeOpts).addTo(map);
				break;
			case 'eb':
			case 'be':
				result = L.polyline(eb, routeOpts).addTo(map);
				break;
			case 'ew':
			case 'we':
				result = L.polyline(ew, routeOpts).addTo(map);
				break;
			case 'ec':
			case 'ce':
				result = L.polyline(ec, routeOpts).addTo(map);
				break;
			case 'eg':
			case 'ge':
				result = L.polyline(eg, routeOpts).addTo(map);
				break;
			case 'ef':
			case 'fe':
				result = L.polyline(ef, routeOpts).addTo(map);
				break;
			case 'hg':
			case 'gh':
				result = L.polyline(hg, routeOpts).addTo(map);
				break;
			case 'hf':
			case 'fh':
				result = L.polyline(hf, routeOpts).addTo(map);
				break;
			case 'hw':
			case 'wh':
				result = L.polyline(hw, routeOpts).addTo(map);
				break;
			case 'hc':
			case 'ch':
				result = L.polyline(hc, routeOpts).addTo(map);
				break;
			case 'hb':
			case 'bh':
				result = L.polyline(hb, routeOpts).addTo(map);
				break;
			case 'gf':
			case 'fg':
				result = L.polyline(gf, routeOpts).addTo(map);
				break;
			case 'gw':
			case 'wg':
				result = L.polyline(gw, routeOpts).addTo(map);
				break;
			case 'gc':
			case 'cg':
				result = L.polyline(gc, routeOpts).addTo(map);
				break;
			case 'gb':
			case 'bg':
				result = L.polyline(gb, routeOpts).addTo(map);
				break;
			case 'fw':
			case 'wf':
				result = L.polyline(fw, routeOpts).addTo(map);
				break;
			case 'fc':
			case 'cf':
				result = L.polyline(fc, routeOpts).addTo(map);
				break;
			case 'fb':
			case 'bf':
				result = L.polyline(fb, routeOpts).addTo(map);
				break;
			case 'wc':
			case 'cw':
				result = L.polyline(wc, routeOpts).addTo(map);
				break;
			case 'wb':
			case 'bw':
				result = L.polyline(wb, routeOpts).addTo(map);
				break;
		}
		if(result) {
			map.fitBounds(result.getBounds());
		}
	}
}