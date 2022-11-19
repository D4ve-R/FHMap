import { Utils } from "./core";
import { Floorplan } from "./model";
import { floorplannerModes } from "./view";
import { FloorplanControl } from "./controller";

export class ViewFloorplanner {  
	fpModel = new Floorplan();
  
	constructor(elementId) {
		this.floorplanner = new FloorplanControl(elementId, this.fpModel);
		const move = document.getElementById('move');
		const remove = document.getElementById('delete');
		const draw = document.getElementById('draw');
		const hint = document.getElementById('draw-walls-hint');
		const activeStlye = 'btn-primary-disabled';
		
		window.addEventListener('resize', () => {
			this.handleWindowResize();
		});
	    this.handleWindowResize();
  
	  // mode buttons
	  this.floorplanner.modeResetCallbacks.add(function(mode) {
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
		this.floorplanner.setMode(floorplannerModes.MOVE);
	  }.bind(this));
  
	  draw.addEventListener('click', function(){
		this.floorplanner.setMode(floorplannerModes.DRAW);
	  }.bind(this));
  
	  remove.addEventListener('click', function(){
		this.floorplanner.setMode(floorplannerModes.DELETE);
	  }.bind(this));
	}
  
	updateFloorplanView() {
	  this.floorplanner.reset();
	}
  
	handleWindowResize() {
	  const canvasWrapper = document.getElementById('floorplanner');
	  canvasWrapper.style.height = window.innerHeight - Utils.offset(canvasWrapper).top + "px";
	  canvasWrapper.style.width = window.innerWidth - Utils.offset(canvasWrapper).left + "px";
	  this.floorplanner.resizeView();
	}; 
}; 
