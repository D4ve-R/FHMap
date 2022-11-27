import Floorplanner from 'floorplanner';

window.addEventListener('load', function() {
	const vfp = new Floorplanner('floorplanner', 'viewer');

	document.getElementById('update-floorplan').addEventListener('click', function() {
		vfp.showViewer();
	});
	document.getElementById('update-view').addEventListener('click', function() {
		vfp.showPlanner();
	});
});
