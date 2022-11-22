import { Floorplanner } from './Floorplanner';

window.addEventListener('load', function() {
	const vfp = new Floorplanner('floorplanner-canvas', 'viewer');

	document.getElementById('update-floorplan').addEventListener('click', function() {
		document.getElementById('floorplanner').style.display = 'none';
		document.getElementById('viewer').style.display = 'block';
		vfp.viewer.render();
	});
	document.getElementById('update-view').addEventListener('click', function() {
		document.getElementById('floorplanner').style.display = 'block';
		document.getElementById('viewer').style.display = 'none';
	});
});
