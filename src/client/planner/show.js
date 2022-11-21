import { Viewer3d } from './view';
import Model from './model';

function getUrlParam(name){
    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

window.addEventListener('load', function() {
	const model = new Model();
	const viewer = new Viewer3d('viewer', model);
	const fileName = getUrlParam('file');
	if (fileName) {
		fetch('data/floors/' + fileName).then(res => res.json()).then(data => {
			model.floorplan.loadFloorplan(data);
			viewer.render();
		});
	}

});