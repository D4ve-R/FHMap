import { Utils } from "./core";
import Model from "./model";
import { FloorplanControl, floorplannerModes, Control3d } from "./controller";

export class Floorplanner {  
	constructor(plannerElId, viewerElId) {
		this.model = new Model();
		this.fpControl = new FloorplanControl(plannerElId, this.model);
		this.viewer = new Control3d(viewerElId, this.model);
		this.fpModel = this.model.floorplan;

		const move = document.getElementById('move');
		const remove = document.getElementById('delete');
		const draw = document.getElementById('draw');
		const hint = document.getElementById('draw-walls-hint');
		const gridSize = document.getElementById('gridsize');
		const level = document.getElementById('level');

		const store = document.getElementById('store');
		const fileInput = document.getElementById('file');
		const exportBtn = document.getElementById('export');

		const activeStlye = 'active';
		
		window.addEventListener('resize', () => {
			this.handleWindowResize();
		});
	    this.handleWindowResize();
  
	  	// mode buttons
	  	this.fpControl.modeResetCallbacks.add(function(mode) {
			draw.classList.add(activeStlye);
			remove.classList.remove(activeStlye);
			move.classList.remove(activeStlye);
			if (mode == floorplannerModes.MOVE) {
				move.classList.add(activeStlye);
			} else if (mode == floorplannerModes.DRAW) {
				draw.classList.add(activeStlye);
			} else if (mode == floorplannerModes.DELETE) {
				remove.classList.add(activeStlye);
			}
		
			if (mode == floorplannerModes.DRAW) {
			  hint.style.display = 'block';
			  hint.classList.add('slide-in');
			  this.handleWindowResize();
			  setTimeout(function() {
				hint.classList.remove('slide-in');
				setTimeout(()=>hint.style.display = 'none', 1000);
			  }, 3000);
			} else {
			  hint.style.display = 'none';
			}
	  	}.bind(this));
  
	  	move.addEventListener('click', function(){
			this.fpControl.setMode(floorplannerModes.MOVE);
	  	}.bind(this));
	  
	  	draw.addEventListener('click', function(){
			this.fpControl.setMode(floorplannerModes.DRAW);
	  	}.bind(this));
	  
	  	remove.addEventListener('click', function(){
			this.fpControl.setMode(floorplannerModes.DELETE);
	  	}.bind(this));

	  	gridSize.addEventListener('change', function(){
			this.fpControl.setGridSize(gridSize.value);
	  	}.bind(this));

		level.addEventListener('change', function(){
			this.fpControl.setLevel(parseInt(level.value));
		}.bind(this));

		store.addEventListener('click', function() {
			const fp = this.fpModel.saveFloorplan();
			const data = JSON.stringify(fp);
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
			link.download = 'floorplan.json';
			link.click();
		}.bind(this));

		exportBtn.addEventListener('click', function() {
			const data = this.floorplan.exportOBJ();
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
			link.download = 'floorplan.obj';
			link.click();
		}.bind(this));

		fileInput.addEventListener('change', function() {
			const file = fileInput.files[0];
			const reader = new FileReader();
			reader.onload = function(e) {
				const data = e.target.result;
				const fp = JSON.parse(data);
				this.fpModel.loadFloorplan(fp);
			}.bind(this);
			reader.readAsText(file);
		}.bind(this));
	}
  
	updateFloorplanView() {
	  this.fpControl.reset();
	}
  
	handleWindowResize() {
	  const canvasWrapper = document.getElementById('floorplanner');
	  canvasWrapper.style.height = window.innerHeight - Utils.offset(canvasWrapper).top + "px";
	  canvasWrapper.style.width = window.innerWidth - Utils.offset(canvasWrapper).left + "px";
	  this.fpControl.resizeView();
	}; 
}; 
