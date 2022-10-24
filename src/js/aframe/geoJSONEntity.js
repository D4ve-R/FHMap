function validateGeoJSONFeature(feature) {
	if(!feature.hasOwnProperty('type') 
		|| !feature.hasOwnProperty('geometry') 
		|| !feature.hasOwnProperty('properties')
		|| !feature.geometry.hasOwnProperty('coordinates')
		)
		throw new Error('Invalid GeoJSON Feature');
}

function createGeoJSONEntity(feature, projected, primitive, scale, color, position) {
	validateGeoJSONFeature(feature);

	if(feature.geometry.type !== 'Point')
		throw new Error('Only Point geometry is supported');
	
	const [ lat, lng ] = feature.geometry.coordinates;
	const _scale = feature.properties.scale || scale || 1;
	const _position = feature.properties.position || position || {x: 0, y: 1, z: 0};
	const _color = feature.properties.color || color || 'blue';
	const _primitive = feature.properties.primitive || primitive || 'a-cone';
	const _projected = projected || '';

	const entity = document.createElement('a-entity');
	entity.setAttribute('look-at', '[gps'+ _projected +'-camera]');
    entity.setAttribute('gps'+ _projected +'-entity-place', {latitude: lat, longitude: lng});
    entity.setAttribute('position', _position);
	
	if(feature.properties.name) {
		const textScale = _scale * 20;
		const text = document.createElement('a-text');
		text.setAttribute('value', feature.properties.name);
		text.setAttribute('scale', {x: textScale, y: textScale, z: textScale});
		text.setAttribute('align', 'center');
		text.setAttribute('position', {x: 0, y: textScale/4, z: 0});
		entity.appendChild(text);
	}
	
	const prim = document.createElement(_primitive);
	prim.setAttribute('scale', {x: _scale, y: _scale, z: _scale});
	prim.setAttribute('material', {color: _color});
	if(_primitive === 'a-cone') {
		prim.setAttribute('radius-bottom', 0.1);
		prim.setAttribute('radius-top', 1);
		prim.setAttribute('height', 3);
	}
    entity.appendChild(prim);
    
    return entity;
}

AFRAME.registerComponent('geojson', {
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
            default: 20
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
		this.i = 1;
		this.geoJSONEntities = [];

		this.visibilityHandler = () => {
			for(const entity in this.geoJSONEntities) {
				if(entity.getAttribute('distance') > 200)
					entity.setAttribute('visible', false);
				else
					entity.setAttribute('visible', true);
			}
		};
		
		const camera = document.querySelector('a-camera');
		if(camera.getAttribute('gps-projected-camera'))
			this.projected = '-projected';

       	try {
			window.dispatchEvent(new Event('geojson-load-start'));

			fetch(this.data.url).then(res => res.json()).then(json => {
				if(typeof json !== 'object' || Array.isArray(json) || json === null)
					throw new Error('Invalid GeoJSON');

				if(json.type === 'FeatureCollection') {
               		json.features.forEach(item => {
						try {
							const entity = createGeoJSONEntity(item, this.projected, this.data.primitive, this.data.scale, this.data.color);
							this.geoJSONEntities.push(entity);
                   			this.el.sceneEl.appendChild(entity);
						} catch(e) { console.warn(e); }

						window.dispatchEvent(new CustomEvent('geojson-load-progress', { 
							progress: this.i++ / this.geoJSONEntities.length
						}));
               		});
				}
				else {
					try {
						const entity = createGeoJSONEntity(json, this.projected, this.data.primitive, this.data.scale, this.data.color);
						this.geoJSONEntities.push(entity);
						this.el.sceneEl.appendChild(entity);
					} catch(e) { console.warn(e); }
				}

				if(this.geoJSONEntities.length < 1)
					throw new Error('No valid features in GeoJSON');
			
            });
        } catch(err) { console.trace(err); }

		if(this.data.updateVisibility)
			this.el.addEventListener('gps-camera-update-position', this.visibilityHandler);

		window.dispatchEvent(new Event('geojson-load-end'));
		
    },
	remove: function() {
		if(this.data.updateVisibility)
			this.el.removeEventListener('gps-camera-update-position', this.visibilityHandler);

		for(const entity in this.geoJSONEntities) {
			this.el.sceneEl.removeChild(entity);
		}
	}
});
