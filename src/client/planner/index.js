import Floorplanner from 'floorplanner';
import api from './api';

window.addEventListener('load', function() {
	new Floorplanner('floorplanner', 'viewer', api);
});
