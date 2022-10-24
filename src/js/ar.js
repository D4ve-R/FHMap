function createAEntity({ name, coords, color, scale }) {
    const textScale = scale * 20;
    const entity = document.createElement('a-entity');
    entity.setAttribute('look-at', '[gps-projected-camera]');
    entity.setAttribute('gps-projected-entity-place', {latitude: coords.lat, longitude: coords.lng});
    entity.setAttribute('position', {x: 0, y: 1, z: 0});

    const text = document.createElement('a-text');
    text.setAttribute('value', name);
    text.setAttribute('scale', {x: textScale, y: textScale, z: textScale});
    text.setAttribute('align', 'center');
    text.setAttribute('position', {x: 0, y: textScale/4, z: 0});
    entity.appendChild(text);

    const cone = document.createElement('a-cone');
    cone.setAttribute('radius-bottom', 0.1);
    cone.setAttribute('radius-top', 1);
    cone.setAttribute('scale', {x: scale, y: scale, z: scale});
    cone.setAttribute('height', 3);
    cone.setAttribute('material', {color: color ?? 'blue'});
    entity.appendChild(cone);
    
    return entity;
}

AFRAME.registerComponent('json-entity', {
    schema: {
        url: {
            type: 'string'
        },
        scale: {
            type: 'number',
            default: 20
        }
    },
    multiple: true,
    init: function() {
              this.loaded = false;
              window.addEventListener('gps-camera-update-position', e => {
                  if(this.loaded === false) {
                      this._load(e.detail.position.latitude, e.detail.position.longitude);
                      this.loaded = true;
                  }
              });
          },
    _load: function(lat, lng) {
               try { 
                   fetch(this.data.url).then(res => res.json()).then(json => {
                       json.forEach(item => {
                           item.scale = this.data.scale;
                           const entity = createAEntity(item);

                           this.el.sceneEl.appendChild(entity);
                       });
                   });
               } catch(err) { console.error(err); } 
           },
    remove: function() {
                window.removeEventListener('gps-camera-updated-postion');
            }
});

function getUrlParam(name){
    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

AFRAME.registerComponent('location-url', {
    init: function() {
              const lat = getUrlParam('lat');
              const lng = getUrlParam('lng');

              if(lat != undefined && lng != undefined) {
                  const entity = createAEntity({name: 'Marker', coords: { lat: lat, lng: lng}, color: 'green', scale: 20});

                  this.el.sceneEl.appendChild(entity);
              }
          }
});

