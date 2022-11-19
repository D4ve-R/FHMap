import { ViewFloorplanner } from './floorplanner';
import { Viewer3d } from './viewer';

window.addEventListener('load', function() {
	let vfp = new ViewFloorplanner('floorplanner-canvas');
	new Viewer3d(vfp.fpModel).render();
}, false);
