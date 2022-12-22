/*
let wayPoints =[
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
	{id: 10, pos: [50.75872155239645, 6.081597805023194], adj: [9, 14, 16]}, // tmp node FG
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
	{id: 41, pos: [50.75861126470319, 6.082389056682587], adj: [14, 40]},
	{id: 42, pos: [50.75989397934437, 6.083880364894868], adj: [22, 43]},
	{id: 43, pos: [50.75980914480572, 6.084167361259461], adj: [42, 44, 45]},
	{id: 44, pos: [50.75919324144391, 6.08392059803009], adj: [24, 43, 46]},
	{id: 45, pos: [50.75970394976423, 6.0844141244888315], adj: [43, 46, 47]},
	{id: 46, pos: [50.75915252027481, 6.08419418334961], adj: [44, 45, 48]},
	{id: 47, pos: [50.7595699105784, 6.084685027599336], adj: [45, 48, 49]},
	{id: 48, pos: [50.759105012199385, 6.084473133087159], adj: [46, 47, 50]},
	{id: 49, pos: [50.75942399406624, 6.084883511066438], adj: [47, 50]},
	{id: 50, pos: [50.75900660246119, 6.084701120853424], adj: [48, 49, 51]},
	{id: 51, pos: [50.75891667614014, 6.084816455841065], adj: [50]}
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
	...wayPoints.slice(40,42).map(p => p.pos),
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

*/

function haversine(lat1, lon1, lat2, lon2) {
	const R = 6371e3; // meters
	const p1 = lat1 * Math.PI/180; 
	const p2 = lat2 * Math.PI/180;
	const dp = (lat2-lat1) * Math.PI/180;
	const dl = (lon2-lon1) * Math.PI/180;

	const a = Math.sin(dp/2) * Math.sin(dp/2) +
		Math.cos(p1) * Math.cos(p2) *
		Math.sin(dl/2) * Math.sin(dl/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	const d = R * c; // in meters
	return d;
}

class Edge {
	constructor(start, end) {
		this.start = start;
		this.end = end;
		this.calcWeight();
	}

	calcWeight() {
		const start = this.start.pos;
		const end = this.end.pos;
		this.weight = haversine(start[0], start[1], end[0], end[1]);
	}

	getClosestPoint(point) {
		const start = this.start.pos;
		const end = this.end.pos;
		const a = end[0] - start[0];
		const b = end[1] - start[1];
		const c = a*a + b*b;
		console.log(a, b, Math.sqrt(c));
		const dot = (point[0] - start[0]) * a + (point[1] - start[1]) * b;
		console.log(dot)
		const closest = [
			start[0] + a, //dot/c,
			start[1] + b //dot/c
		];
		return closest;
	}
}

class PriorityQueue {
	constructor() {
		this._nodes = [];
	}

	enqueue(key, priority) {
		this._nodes.push({key: key, priority: priority});
		this.sort();
	}

	dequeue() {
		return this._nodes.shift().key;
	}

	sort() {
		this._nodes.sort((a, b) => a.priority < b.priority ? -1 : 1);
	}

	isEmpty() {
		return !this._nodes.length > 0;
	}
}

class Graph {
	nodes = [];
	edges = [];
	endPoints = {};

	constructor(nodes) {
		this.init(nodes);
	}

	init(nodes){
		for(let node of nodes) { 
			this.nodes[node.id] = node;
			if(node.adj.length < 2){
				this.endPoints[node.name] = node;
			}
			node.adj.forEach(idx => {
				const n = nodes[idx];
				this.addEdge(node, n);
			});
		}
	}

	addEdge(start, end) {
		const edge = new Edge(start, end);
		this.edges[start.id] = this.edges[start.id] || [];
		this.edges[end.id] = this.edges[end.id] || [];
		this.edges[start.id].push(edge);
	}

	async dijkstra(start, end, map) {
		const dist = {};
		const prev = {};
		const Q = new PriorityQueue();
		const edges = this.edges;
		let u;
		let alt;

		dist[start.id] = 0;
		Q.enqueue(start.id, 0);
		while(!Q.isEmpty()) {
			u = Q.dequeue();

			if(u === end.id) {
				break;
			}
			for(let edge of edges[u]) {
				alt = dist[u] + edge.weight;

				const line = L.polyline([edge.start.pos, edge.end.pos], {
					color: '#0000ff',
					weight: 3
				}).addTo(map);
				await new Promise(resolve => setTimeout(resolve, 250));
				//line.remove();

				if(!dist[edge.end.id] || alt < dist[edge.end.id]) {
					dist[edge.end.id] = alt;
					prev[edge.end.id] = u;
					Q.enqueue(edge.end.id, alt);
				}
			}
		}
		return {
			distance: dist[end.id],
			path: this.reconstructPath(prev, start, end)
		};
	}

	async astar(start, end) {
		const dist = {};
		const prev = {};
		const Q = new PriorityQueue();
		const edges = this.edges;
		let u;
		let alt;

		dist[start.id] = 0;
		Q.enqueue(start.id, 0);
		while(!Q.isEmpty()) {
			u = Q.dequeue();

			if(u === end.id) {
				break;
			}
			for(let edge of edges[u]) {
				alt = dist[u] + edge.weight;

				if(!dist[edge.end.id] || alt < dist[edge.end.id]) {
					dist[edge.end.id] = alt;
					prev[edge.end.id] = u;
					Q.enqueue(edge.end.id, alt + this.heuristic(edge.end, end));
				}
			}
		}
		return {
			distance: dist[end.id],
			path: this.reconstructPath(prev, start, end)
		};
	}

	heuristic(start, end) {
		return haversine(start.pos[0], start.pos[1], end.pos[0], end.pos[1]) / 2.0;
	}

	reconstructPath(prev, start, end) {
		const path = [];
		let u = end;

		while(prev[u.id] !== undefined) {
			path.push(u);
			u = this.nodes[prev[u.id]];
			if(u === start) {
				path.push(u);
				break;
			}
		}
		return path;
	}

	getClosestPoint(point) {
		let min = Infinity;
		let closestPoint = null;
		this.nodes.forEach(node => {
			const dist = haversine(point[0], point[1], node.pos[0], node.pos[1]);
			if (dist < min) {
				min = dist;
				closestPoint = node;
			}
		});
		/*
		// get closest point on edge
			this.edges[closestPoint.id].forEach(edge =>  {
				const closest = edge.getClosestPoint(point);
				const dLat = point[0] - closest[0];
				const dLng = point[1] - closest[1];
				const dist = Math.sqrt(dLat*dLat + dLng*dLng);
				if (dist < min) {
					min = dist;
					closestEdge = edge;
					closestPoint = closest;
				}
			});
			*/
		return closestPoint;
	}
}

class Router {
	routes = {};
	graph = null;
	loaded = false;
	constructor(geoJSONUrl)
	{
		this.loadPointsFromGeoJSON(geoJSONUrl).then((wayPoints) => {
			this.graph = new Graph(wayPoints);
			this.loaded = true;
		});
	}

	async loadPointsFromGeoJSON(url) {
		const res = await fetch(url);
		const data = await res.json();
		const wayPoints = data.features.map((feature, i) => {
			return {
				id: feature.properties.id,
				pos: feature.geometry.coordinates,
				adj: feature.properties.adj,
				name: feature.properties.name || ''
			};
		});
		return wayPoints;
	}

	async checkLoaded() {
		if (!this.loaded) {
			await new Promise(resolve => setTimeout(resolve, 50));
			await this.checkLoaded();
		}
	}

	getRoutes() {
		return this.routes;
	}

	async calculateRoute(start, end) {
		return await this.graph.astar(start, end)
	}

	calculateAllRoutes() {
		this.checkLoaded();
		for (let start in graph.endPoints) {
			for (let end in graph.endPoints) {
				if (start !== end) {
					this.calculateRoute(start, end).then((route) => {
						this.routes[start.name + end.name] = route;
					});
				}
			}
		}
		return this.routes;
	}

	async calculateRouteFromGps(start, end) {
		await this.checkLoaded();
		const startNode = this.graph.getClosestPoint(start);
		const endNode = this.graph.getClosestPoint(end);
		return await this.calculateRoute(startNode, endNode);
	}

	async calculateRouteFromId(start, end) {
		await this.checkLoaded();
		const startNode = this.graph.nodes[start];
		const endNode = this.graph.nodes[end];
		return await this.calculateRoute(startNode, endNode);
	}

	async calculateRouteFromName(start, end) {
		await this.checkLoaded();
		const startNode = this.graph.endPoints[start];
		const endNode = this.graph.endPoints[end];
		return await this.calculateRoute(startNode, endNode);
	}
}
