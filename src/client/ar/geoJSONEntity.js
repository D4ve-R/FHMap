import * as AFRAME from "aframe";

class GeoJSONError extends Error {
	constructor(message, geojson) {
		const props = {
			geojson: geojson,
		};
		super(message, props);
		this.name = 'GeoJSONError';
	}
}

function validateGeoJSONFeature(feature) {
	if(!feature.hasOwnProperty('type') 
		|| !feature.hasOwnProperty('geometry') 
		|| !feature.hasOwnProperty('properties')
		|| !feature.geometry.hasOwnProperty('coordinates')
		)
		throw new GeoJSONError('Invalid GeoJSON Feature', feature);
}

function GeoJSONEntity(feature, projected, primitive, scale, color, position) {
	validateGeoJSONFeature(feature);

	if(feature.geometry.type !== 'Point')
		throw new GeoJSONError('Only Point geometry is supported', feature);
	
	const [ lat, lng ] = feature.geometry.coordinates;
	const _scale = feature.properties.scale || scale || 1;
	const _position = feature.properties.position || position || {x: 0, y: 0, z: 0};
	const _color = feature.properties.color || color || 'blue';
	const _primitive = feature.properties.primitive || primitive || 'a-cone';
	const _projected = projected || '';

	const entity = document.createElement('a-entity');
	entity.setAttribute('look-at', '[gps'+ _projected +'-camera]');
    entity.setAttribute('gps'+ _projected +'-entity-place', {latitude: lat, longitude: lng});
    entity.setAttribute('position', _position);
	
	if(feature.properties.name) {
		const textScale = _scale * 10;
		const text = document.createElement('a-text');
		text.setAttribute('value', feature.properties.name);
		text.setAttribute('scale', {x: textScale, y: textScale, z: textScale});
		text.setAttribute('align', 'center');
		text.setAttribute('position', {x: 0, y: textScale/5, z: 0});
		entity.appendChild(text);
	}
	
	const prim = document.createElement(_primitive);
	prim.setAttribute('scale', {x: _scale, y: _scale, z: _scale});
	prim.setAttribute('material', {color: _color});
	if(_primitive === 'a-cone') {
		prim.setAttribute('radius-bottom', 0.1);
		prim.setAttribute('radius-top', 0.75);
		prim.setAttribute('height', 2);
	}
    entity.appendChild(prim);
    
    return entity;
}

AFRAME.registerComponent('geojson-entity', {
    schema: {
        url: {
            type: 'string',
			default: ''
        },
		primitive: {
			type: 'string',
			default: 'a-cone'
		},
        scale: {
            type: 'number',
            default: 10
        },
		color: {
			type: 'string',
			default: 'blue'
		},
		updateVisibility: {
			type: 'boolean',
			default: false
		}
    },
    multiple: true,
    init: function() {		
		const camera = document.querySelector('a-camera');
		if(camera.getAttribute('gps-projected-camera'))
			this.projected = '-projected';
		else if(camera.getAttribute('gps-new-camera'))
			this.projected = '-new';

		window.addEventListener('gps-camera-update-position', e => {
			this.el.setAttribute('terrarium-dem', {
				lat: e.detail.position.latitude,
				lon: e.detail.position.longitude 
			})
		});

		this.el.addEventListener('elevation-available', e => {
            const position = camera.getAttribute('position');
            position.y = e.detail.elevation + 1.6;
            camera.setAttribute('position', position);
        });

		this.el.addEventListener('osm-data-loaded', e => {
            console.log(e.detail);
			//this.geoJSONEntities.forEach(entity => entity.setAttribute('position', true));
		});

	},
	update: function() {
		this.loader = document.createElement('div');
    	this.loader.classList.add('ar-loader');
    	document.body.appendChild(this.loader);

		if(this.geoJSONEntities?.length > 0)
			this.geoJSONEntities.forEach(entity => this.el.sceneEl.removeChild(entity));

		this.geoJSONEntities = [];
		this.i = 0;
		const data = this.data;

       	try {
			window.dispatchEvent(new Event('geojson-load-start'));

			fetch(data.url).then(res => res.json()).then(json => {
				if(typeof json !== 'object' || Array.isArray(json) || json === null)
					throw new GeoJSONError('Invalid GeoJSON', json);

				if(json.type === 'FeatureCollection') {
               		json.features.forEach(item => {
						try {
							const entity = GeoJSONEntity(item, this.projected, data.primitive, data.scale, data.color);
							this.geoJSONEntities.push(entity);
                   			this.el.sceneEl.appendChild(entity);
						} catch(e) { console.warn(e); }

						window.dispatchEvent(new CustomEvent('geojson-load-progress', { 
							progress: ++this.i / this.geoJSONEntities.length
						}));
               		});
				}
				else {
					try {
						const entity = GeoJSONEntity(json, this.projected, data.primitive, data.scale, data.color);
						this.geoJSONEntities.push(entity);
						this.el.sceneEl.appendChild(entity);
					} catch(e) { console.warn(e); }
				}

				if(this.geoJSONEntities.length < 1)
					throw new GeoJSONError('No valid features in GeoJSON', undefined);
			
            });
        } catch(err) { console.trace(err); }

		if(data.updateVisibility)
			this.el.addEventListener('gps-camera-update-position', this.visibilityHandler);

		window.dispatchEvent(new CustomEvent('geojson-load-end', { geojson: this.geoJSONEntities }));
		this.loader.remove();
    },
	remove: function() {
		if(data.updateVisibility)
			this.el.removeEventListener('gps-camera-update-position', this.visibilityHandler);

		this.geoJSONEntities.forEach(entity => this.el.sceneEl.removeChild(entity));
	},
	visibilityHandler: function(e) {
		e.target.getAttribute('distance') > 100 ?
			e.target.setAttribute('visible', false)
			: e.target.setAttribute('visible', true);
	}
});
