import { Utils, Callbacks } from "../core";
import { Vector2, Vector3, Mesh, MeshBasicMaterial, PlaneGeometry, Raycaster } from "three";
import { Viewer3d } from "../view";
import { Floorplan3d } from '../3d';

const states = {
	UNSELECTED: 0, // no object selected
	SELECTED: 1, // selected but inactive
	DRAGGING: 2, // performing an action while mouse depressed
	ROTATING: 3,  // rotating with mouse down
	ROTATING_FREE: 4, // rotating with mouse up
	PANNING: 5
};

export class Control3d {
	constructor(elId, model, hud) {
	  	this.enabled = true;
  
	  	this.model = model;
		this.scene = this.model.scene;

		this.itemSelectedCallbacks = new Callbacks(); // item
		this.itemUnselectedCallbacks = new Callbacks();
	
		this.wallClicked = new Callbacks(); // wall
		this.floorClicked = new Callbacks(); // floor
		this.nothingClicked = new Callbacks();

		this.view = new Viewer3d(elId, this.model);
	  	this.element = this.view.domEl;
	  	this.camera = this.view.camera;
		this.controls = this.view.orbit;
		this.floorplan = this.model.floorplan;
		this.floorplan3d = new Floorplan3d(this.scene, this.floorplan, this.controls);

	  	this.hud = hud;
  
	  	this.plane; // ground plane used for intersection testing
	  	this.intersectedObject;
	  	this.mouseoverObject;

	  	this.mouseDown = false;
	  	this.mouseMoved = false; // has mouse moved since down click
  
	  	this.rotateMouseOver = false;
  
	  	this.state = states.UNSELECTED;
  
	  	this.needsUpdate = true;
  
		this.element.addEventListener('mousedown', this.mouseDownEvent.bind(this));
		this.element.addEventListener('mouseup', this.mouseUpEvent.bind(this));
		this.element.addEventListener('mousemove',this.mouseMoveEvent.bind(this));
  
		this.mouse = new Vector2();
  
		this.scene.itemRemovedCallbacks.add(this.itemRemoved.bind(this));
		this.scene.itemLoadedCallbacks.add(this.itemLoaded.bind(this));
		this.setGroundPlane();
	}
	  
  
	  // invoked via callback when item is loaded
	itemLoaded(item) {
		if (!item.position_set) {
		  this.setSelectedObject(item);
		  this.switchState(states.DRAGGING);
		  const pos = item.position.clone();
		  pos.y = 0;
		  const vec = this.projectVector(pos);
		  this.clickPressed(vec);
		}
		item.position_set = true;
	}
  
	clickPressed(vec2) {
		vec2 = vec2 || this.mouse;
		const intersection = this.itemIntersection(mouse, selectedObject);
		if (intersection) {
		  this.selectedObject.clickPressed(intersection);
		}
	}
  
	clickDragged(vec2) {
		vec2 = vec2 || this.mouse;
		const intersection = scope.itemIntersection(this.mouse, this.selectedObject);
		if (intersection) {
		  if (this.isRotating()) {
			this.selectedObject.rotate(intersection);
		  } else {
			this.selectedObject.clickDragged(intersection);
		  }
		}
	}
  
	itemRemoved(item) {
		// invoked as a callback to event in Scene
		if (item === this.selectedObject) {
		  this.selectedObject.setUnselected();
		  this.selectedObject.mouseOff();
		  this.setSelectedObject(null);
		}
	}
  
	setGroundPlane() {
		// ground plane used to find intersections
		const size = 10000;
		this.plane = new Mesh(
		  new PlaneGeometry(size, size),
		  new MeshBasicMaterial());
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.visible = false;
		this.scene.add(this.plane);
	}
  
	checkWallsAndFloors(event) {
  
		// double click on a wall or floor brings up texture change modal
		if (this.state == states.UNSELECTED && this.mouseoverObject == null) {
		  // check walls
		  const wallEdgePlanes = this.floorplan.wallEdgePlanes();
		  const wallIntersects = this.getIntersections(
			this.mouse, wallEdgePlanes, true);
		  if (wallIntersects.length > 0) {
			const wall = wallIntersects[0].object.edge;
			this.wallClicked.fire(wall);
			return;
		  }
  
		  // check floors
		  const floorPlanes = this.floorplan.floorPlanes();
		  const floorIntersects = this.getIntersections(
			this.mouse, floorPlanes, false);
		  if (floorIntersects.length > 0) {
			const room = floorIntersects[0].object.room;
			this.floorClicked.fire(room);
			return;
		  }
  
		  this.nothingClicked.fire();
		}
  
	}
  
	mouseMoveEvent(event) {
		if (this.enabled) {
		  event.preventDefault();
  
		  this.mouseMoved = true;
  
		  this.mouse.x = event.clientX;
		  this.mouse.y = event.clientY;
  
		  if (!this.mouseDown) {
			this.updateIntersections();
		  }
  
		  switch (this.state) {
			case states.UNSELECTED:
			  this.updateMouseover();
			  break;
			case states.SELECTED:
			  this.updateMouseover();
			  break;
			case states.DRAGGING:
			case states.ROTATING:
			case states.ROTATING_FREE:
			  this.clickDragged();
			  //this.hud.update();
			  this.needsUpdate = true;
			  break;
		  }
		}
	}
  
	isRotating = function () {
		return (this.state == states.ROTATING || this.state == states.ROTATING_FREE);
	}
  
	mouseDownEvent(event) {
		if (this.enabled) {
		  event.preventDefault();
  
		  this.mouseMoved = false;
		  this.mouseDown = true;
  
		  switch (this.state) {
			case states.SELECTED:
			  if (rotateMouseOver) {
				this.switchState(states.ROTATING);
			  } else if (this.intersectedObject != null) {
				this.setSelectedObject(this.intersectedObject);
				if (!this.intersectedObject.fixed) {
				  this.switchState(states.DRAGGING);
				}
			  }
			  break;
			case states.UNSELECTED:
			  if (this.intersectedObject != null) {
				this.setSelectedObject(this.intersectedObject);
				if (!this.intersectedObject.fixed) {
				  this.switchState(states.DRAGGING);
				}
			  }
			  break;
			case states.DRAGGING:
			case states.ROTATING:
			  break;
			case states.ROTATING_FREE:
			  this.switchState(states.SELECTED);
			  break;
		  }
		}
	}
  
	mouseUpEvent(event) {
		if (this.enabled) {
		  this.mouseDown = false;
  
		  switch (this.state) {
			case states.DRAGGING:
			  this.selectedObject.clickReleased();
			  this.switchState(states.SELECTED);
			  break;
			case states.ROTATING:
			  if (!this.mouseMoved) {
				this.switchState(states.ROTATING_FREE);
			  } else {
				this.switchState(states.SELECTED);
			  }
			  break;
			case states.UNSELECTED:
			  if (!this.mouseMoved) {
				this.checkWallsAndFloors();
			  }
			  break;
			case states.SELECTED:
			  if (this.intersectedObject == null && !this.mouseMoved) {
				this.switchState(states.UNSELECTED);
				this.checkWallsAndFloors();
			  }
			  break;
			case states.ROTATING_FREE:
			  break;
		  }
		}
	}
  
	switchState(newState) {
		if (newState != this.state) {
		  onExit(this.state);
		  onEntry(newState);
		}
		this.state = newState;
		//this.hud.setRotating(this.isRotating());
	}
  
	onEntry(state) {
		switch (state) {
		  case states.UNSELECTED:
			this.setSelectedObject(null);
		  case states.SELECTED:
			this.controls.enabled = true;
			break;
		  case states.ROTATING:
		  case states.ROTATING_FREE:
			this.controls.enabled = false;
			break;
		  case states.DRAGGING:
			this.setCursorStyle("move");
			this.clickPressed();
			this.controls.enabled = false;
			break;
		}
	}
  
	onExit(state) {
		switch (state) {
		  case states.UNSELECTED:
		  case states.SELECTED:
			break;
		  case states.DRAGGING:
			if (this.mouseoverObject) {
			  this.setCursorStyle("pointer");
			} else {
			  this.setCursorStyle("auto");
			}
			break;
		  case states.ROTATING:
		  case states.ROTATING_FREE:
			break;
		}
	}
  
	selectedObject() {
		return this.selectedObject;
	}
  
	  // updates the vector of the intersection with the plane of a given
	  // mouse position, and the intersected object
	  // both may be set to null if no intersection found
	updateIntersections() {
  
		// check the rotate arrow
		const hudObject = this.hud?.getObject();
		if (hudObject) {
		  const hudIntersects = this.getIntersections(
			this.mouse,
			hudObject,
			false, false, true);
		  if (hudIntersects.length > 0) {
			this.rotateMouseOver = true;
			this.hud.setMouseover(true);
			this.intersectedObject = null;
			return;
		  }
		}
		this.rotateMouseOver = false;
		//this.hud.setMouseover(false);
  
		// check objects
		const items = this.scene.getItems();
		const intersects = this.getIntersections(
		  this.mouse,
		  items,
		  false, true);
  
		if (intersects.length > 0) {
		  this.intersectedObject = intersects[0].object;
		} else {
		  this.intersectedObject = null;
		}
	}
  
	  // sets coords to -1 to 1
	normalizeVector2(vec2) {
		const retVec = new Vector2();
		retVec.x = ((vec2.x - this.view.widthMargin) / (window.innerWidth - this.view.widthMargin)) * 2 - 1;
		retVec.y = -((vec2.y - this.view.heightMargin) / (window.innerHeight - this.view.heightMargin)) * 2 + 1;
		return retVec;
	}
  
	  //
	mouseToVec3(vec2) {
		const normVec2 = this.normalizeVector2(vec2)
		const vector = new Vector3(
		  normVec2.x, normVec2.y, 0.5);
		vector.unproject(this.camera);
		return vector;
	}
  
	  // returns the first intersection object
	itemIntersection(vec2, item) {
		const customIntersections = item.customIntersectionPlanes();
		let intersections = null;
		if (customIntersections && customIntersections.length > 0) {
		  intersections = this.getIntersections(vec2, customIntersections, true);
		} else {
		  intersections = this.getIntersections(vec2, this.plane);
		}
		if (intersections.length > 0) {
		  return intersections[0];
		} else {
		  return null;
		}
	}
  
	  // filter by normals will only return objects facing the camera
	  // objects can be an array of objects or a single object
	getIntersections(vec2, objects, filterByNormals, onlyVisible, recursive, linePrecision) {
  
		const vector = this.mouseToVec3(vec2);
  
		onlyVisible = onlyVisible || false;
		filterByNormals = filterByNormals || false;
		recursive = recursive || false;
		linePrecision = linePrecision || 20;
  
  
		const direction = vector.sub(this.camera.position).normalize();
		const raycaster = new Raycaster(
		  this.camera.position,
		  direction);
		raycaster.linePrecision = linePrecision;
		let intersections;
		if (objects instanceof Array) {
		  intersections = raycaster.intersectObjects(objects, recursive);
		} else {
		  intersections = raycaster.intersectObject(objects, recursive);
		}
		// filter by visible, if true
		if (onlyVisible) {
		  intersections = Utils.removeIf(intersections, function (intersection) {
			return !intersection.object.visible;
		  });
		}
  
		// filter by normals, if true
		if (filterByNormals) {
		  intersections = Utils.removeIf(intersections, function (intersection) {
			var dot = intersection.face.normal.dot(direction);
			return (dot > 0)
		  });
		}
		return intersections;
	}
  
	  // manage the selected object
	setSelectedObject(object) {
		if (this.state === states.UNSELECTED) {
		  this.switchState(states.SELECTED);
		}
		if (this.selectedObject != null) {
		  this.selectedObject.setUnselected();
		}
		if (object != null) {
		  this.selectedObject = object;
		  this.selectedObject.setSelected();
		  this.itemSelectedCallbacks.fire(object);
		} else {
		  this.selectedObject = null;
		  this.itemUnselectedCallbacks.fire();
		}
		this.needsUpdate = true;
	}
  
	  // TODO: there MUST be simpler logic for expressing this
	updateMouseover() {
		if (this.intersectedObject != null) {
		  if (this.mouseoverObject != null) {
			if (this.mouseoverObject !== this.intersectedObject) {
			  this.mouseoverObject.mouseOff();
			  this.mouseoverObject = this.intersectedObject;
			  this.mouseoverObject.mouseOver();
			  this.needsUpdate = true;
			} else {
			  // do nothing, mouseover already set
			}
		  } else {
			this.mouseoverObject = this.intersectedObject;
			this.mouseoverObject.mouseOver();
			this.setCursorStyle("pointer");
			this.needsUpdate = true;
		  }
		} else if (this.mouseoverObject != null) {
		  this.mouseoverObject.mouseOff();
		  this.setCursorStyle("auto");
		  this.mouseoverObject = null;
		  this.needsUpdate = true;
		}
	}

	projectVector(vec3, ignoreMargin) {
		ignoreMargin = ignoreMargin || false;
  
		const widthHalf = this.element.clientWidth / 2;
		const heightHalf = this.element.clientHeight / 2;
  
		const vector = new Vector3();
		vector.copy(vec3);
		vector.project(camera);
  
		const vec2 = new Vector2();
  
		vec2.x = (vector.x * widthHalf) + widthHalf;
		vec2.y = - (vector.y * heightHalf) + heightHalf;
  
		if (!ignoreMargin) {
		  vec2.x += this.view.widthMargin;
		  vec2.y += this.view.heightMargin;
		}
  
		return vec2;
	}

	setCursorStyle(cursorStyle) {
		this.element.style.cursor = cursorStyle;
	};
}
  