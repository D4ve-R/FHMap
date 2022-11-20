import { ViewFloorplanner } from './floorplanner';
import { Viewer3d } from './viewer';

window.addEventListener('load', function() {
	const vfp = new ViewFloorplanner('floorplanner-canvas');
	const viewer = new Viewer3d(vfp.fpModel, 'viewer');

	document.getElementById('update-floorplan').addEventListener('click', function() {
		document.getElementById('floorplanner').style.display = 'none';
		document.getElementById('viewer').style.display = 'block';
		viewer.render();
	});
	document.getElementById('update-view').addEventListener('click', function() {
		document.getElementById('floorplanner').style.display = 'block';
		document.getElementById('viewer').style.display = 'none';
	});
}, false);
