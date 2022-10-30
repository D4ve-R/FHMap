// import getUrlParams from '../utils.js';

function createUrlEntity({ name, coords, projected, primitive, color, scale }) {
    const textScale = scale * 20;
    const entity = document.createElement('a-entity');
    entity.setAttribute('look-at', '[gps'+projected+'-camera]');
    entity.setAttribute('gps'+projected+'-entity-place', {latitude: coords.lat, longitude: coords.lng});
    entity.setAttribute('position', {x: 0, y: 1, z: 0});

    const text = document.createElement('a-text');
    text.setAttribute('value', name);
    text.setAttribute('scale', {x: textScale, y: textScale, z: textScale});
    text.setAttribute('align', 'center');
    text.setAttribute('position', {x: 0, y: textScale/4, z: 0});
    entity.appendChild(text);

    const prim = document.createElement(primitive);
	prim.setAttribute('scale', {x: scale, y: scale, z: scale});
	prim.setAttribute('material', {color: color});
	if(primitive === 'a-cone') {
		prim.setAttribute('radius-bottom', 0.1);
		prim.setAttribute('radius-top', 1);
		prim.setAttribute('height', 3);
	}
    entity.appendChild(prim);
    
    return entity;
}

AFRAME.registerComponent('location-url', {
	schema: {
		name: {
			type: 'string',
			default: 'Marker'
		},
        scale: {
            type: 'number',
            default: 20
        },
		color: {
			type: 'string',
			default: 'blue'
		},
		primitive: {
			type: 'string',
			default: 'a-cone'
		}
    },
    init: function() {
              const lat = getUrlParam('lat');
              const lng = getUrlParam('lng');
			  const name = getUrlParam('name');

			  const camera = document.querySelector('a-camera');
			  if(camera.getAttribute('gps-projected-camera'))
			  	this.projected = '-projected';
			  else if(camera.getAttribute('gps-new-camera'))
				this.projected = '-new';

              if(lat != undefined && lng != undefined) {
                  const entity = createUrlEntity({
						name: name || this.data.name,
						projected: this.projected || '',
						coords: { lat: lat, lng: lng },
						primitive: this.data.primitive,
						color: this.data.color, 
						scale: this.data.scale
					});

                  this.el.sceneEl.appendChild(entity);
              }
          }
});
