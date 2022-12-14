import * as AFRAME from "aframe";

AFRAME.registerComponent('path-entity', {
	schema: {
		url: {
			type: 'string',
			default: ''
		},
		color: {
			type: 'string',
			default: 'green'
		}
	},
	dependencies: ['gps-projected-camera'],
	multiple: true,
	init: function() {
		this.projected = '';

		this.loader = document.createElement('div');
    	this.loader.classList.add('ar-loader');
    	document.body.appendChild(this.loader);

		const camera = document.querySelector('a-camera');
		if(camera.getAttribute('gps-projected-camera'))
			this.projected = '-projected';
		else if(camera.getAttribute('gps-new-camera'))
			this.projected = '-new';


		this.camera = camera.components[`gps${this.projected}-camera`];

		window.addEventListener('gps-camera-origin-coord-set', this.create.bind(this));
	},
	update: function() {
		this.create();
	},
	create: function() {
		this.pathEntities?.length > 0 && this.pathEntities.forEach(pathEntity => pathEntity.remove());
		this.pathEntities = [];
		this.i = 1;
		try {
			fetch(this.data.url).then(res => res.json()).then(json => {
				if(typeof json !== 'object' || Array.isArray(json) || json === null)
					throw new Error('Invalid GeoJSON');
				
				if(json.type === 'FeatureCollection') {
					json.features.forEach(item => {	
						try {
							const entity = this._createPathEntity(item, this.data.color);
							this.pathEntities.push(entity);
							this.el.sceneEl.appendChild(entity);
						} catch(e) { console.warn(e); }
					});

					window.dispatchEvent(new CustomEvent('geojson-load-progress', { 
						progress: this.i++ / this.pathEntities.length
					}));
				}
				else {
					try {
						const entity = this._createPathEntity(json, this.data.color);
						this.pathEntities.push(entity);
						this.el.sceneEl.appendChild(entity);
					} catch(e) { console.warn(e); }
				}

				if(this.pathEntities.length < 1)
					throw new Error('No valid features in GeoJSON');

			});
		} catch(e) { console.trace(e); }

		window.dispatchEvent(new CustomEvent('geojson-load-end', { path: this.pathEntities }));
		this.loader.remove();
	},
	_createPathEntity: function(feature, color) {
		const _color = feature.properties.color || color || 'blue';
		this.rendererSystem = this.el.sceneEl.systems.renderer;
	
		if(feature.geometry.type !== 'LineString') 
			throw new Error('PathEntity only supports LineString geometries');
	
		if(feature.geometry.coordinates.length < 2) 
			throw new Error('PathEntity requires at least two coordinates');
	
		const path = document.createElement('a-entity');
		const material = new THREE.LineBasicMaterial({
			color: new THREE.Color(0x00ff00),
			linewidth: 10,
		});
		
		let points = [];
		for(let i = 0; i < feature.geometry.coordinates.length - 1; i++) {
			const [ startLat, startLng ] = feature.geometry.coordinates[i];
			const [ endLat, endLng ] = feature.geometry.coordinates[i+1];
			const startPos = this.camera.latLonToWorld(startLat, startLng);
			const endPos = this.camera.latLonToWorld(endLat, endLng);
			points.push(new THREE.Vector3(startPos[0], 0.3, startPos[1]));
			points.push(new THREE.Vector3(endPos[0], 0.3, endPos[1]));

			const id = `line__${feature.properties.name.toLowerCase()}${i}`;
			/*path.setAttribute(id, {
				start: {x: startPos[0], y: 0, z: startPos[1]},
				end: {x: endPos[0], y: 0, z: endPos[1]},
				color: _color
			});*/
		}
		
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		path.setObject3D(feature.properties.name, new THREE.Line(geometry, material));
		this.rendererSystem.applyColorCorrection(material.color);

		return path;
	}
});
