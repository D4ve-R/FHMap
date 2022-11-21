import { Viewer3d } from './viewer';
import { Floorplan } from './model';

function getUrlParam(name){
    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

window.addEventListener('load', function() {
	const fpModel = new Floorplan();
	const viewer = new Viewer3d(fpModel, 'viewer');
	const fileName = getUrlParam('file');
	if (fileName) {
		fetch('data/floors/' + fileName).then(res => res.json()).then(data => {
			fpModel.loadFloorplan(data);
			viewer.render();
		});
	}

});