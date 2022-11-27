import { Control3d, Model } from 'floorplanner';

function getUrlParam(name){
    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

window.addEventListener('load', function() {
	const model = new Model();
	const viewer = new Control3d('viewer', model, false);
	const fileName = getUrlParam('file');
	if (fileName) {
		fetch('data/floors/' + fileName).then(res => res.json()).then(data => {
			model.loadSerialized(JSON.stringify(data));
			viewer.render();
		});
	}

});