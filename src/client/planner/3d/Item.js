import { Utils } from '../core';
import {
	Mesh,
	Vector3,
	Matrix4,
	Box3,
	MeshBasicMaterial,
	AdditiveBlending
} from 'three';

export class Item extends Mesh {

  /** */
  errorGlow = new Mesh();

  /** */
  hover = false;

  /** */
  selected = false;

  /** */
  highlighted = false;

  /** */
  error = false;

  /** */
  emissiveColor = 0x444444;

  /** */
  errorColor = 0xff0000;

  /** */
  resizable = true;

  /** Does this object affect other floor items */
  obstructFloorMoves = true;

  /** */
  position_set = false;

  /** Show rotate option in context menu */
  allowRotate = true;

  /** */
  fixed = false;

  /** dragging */
  dragOffset = new Vector3();

  /** */
  halfSize = new Vector3();

  /** Constructs an item. 
   * @param scene TODO
   * @param metadata TODO
   * @param geometry TODO
   * @param material TODO
   * @param position TODO
   * @param rotation TODO
   * @param scale TODO 
   */
  constructor(scene, geometry, material, position, rotation, scale) {
	super();

	this.scene = scene;
	this.geometry = geometry;
	this.material = material;

	this.errorColor = 0xff0000;


	this.castShadow = true;
	this.receiveShadow = false;

	this.geometry = geometry;
	this.material = material;

	if (position) {
	  this.position.copy(position);
	  this.position_set = true;
	} else {
	  this.position_set = false;
	}

	// center in its boundingbox
	this.geometry.computeBoundingBox();
	this.geometry.applyMatrix(new Matrix4().makeTranslation(
	  - 0.5 * (this.geometry.boundingBox.max.x + this.geometry.boundingBox.min.x),
	  - 0.5 * (this.geometry.boundingBox.max.y + this.geometry.boundingBox.min.y),
	  - 0.5 * (this.geometry.boundingBox.max.z + this.geometry.boundingBox.min.z)
	));
	this.geometry.computeBoundingBox();
	this.halfSize = this.objectHalfSize();

	if (rotation) {
	  this.rotation.y = rotation;
	}

	if (scale != null) {
	  this.setScale(scale.x, scale.y, scale.z);
	}
  };

  /** */
  remove() {
	this.scene.removeItem(this);
  };

  /** */
  resize(height, width, depth) {
	var x = width / this.getWidth();
	var y = height / this.getHeight();
	var z = depth / this.getDepth();
	this.setScale(x, y, z);
  }

  /** */
  setScale(x, y, z) {
	var scaleVec = new Vector3(x, y, z);
	this.halfSize.multiply(scaleVec);
	scaleVec.multiply(this.scale)
	this.scale.set(scaleVec.x, scaleVec.y, scaleVec.z);
	this.resized();
	this.scene.needsUpdate = true;
  };

  /** */
  setFixed(fixed) {
	this.fixed = fixed;
  }

  /** Subclass can define to take action after a resize. */
  resized(){}

  /** */
  getHeight() {
	return this.halfSize.y * 2.0;
  }

  /** */
  getWidth() {
	return this.halfSize.x * 2.0;
  }

  /** */
  getDepth() {
	return this.halfSize.z * 2.0;
  }

  /** */
  placeInRoom(){}

  /** */
  initObject = function () {
	this.placeInRoom();
	// select and stuff
	this.scene.needsUpdate = true;
  };

  /** */
  removed() {
  }

  /** on is a bool */
  updateHighlight() {
	var on = this.hover || this.selected;
	this.highlighted = on;
	var hex = on ? this.emissiveColor : 0x000000;
	(this.material).materials.forEach((material) => {
	  // TODO_Ekki emissive doesn't exist anymore?
	  (material).emissive.setHex(hex);
	});
  }

  /** */
  mouseOver() {
	this.hover = true;
	this.updateHighlight();
  };

  /** */
  mouseOff() {
	this.hover = false;
	this.updateHighlight();
  };

  /** */
  setSelected() {
	this.selected = true;
	this.updateHighlight();
  };

  /** */
  setUnselected() {
	this.selected = false;
	this.updateHighlight();
  };

  /** intersection has attributes point (vec3) and object (Mesh) */
  clickPressed(intersection) {
	this.dragOffset.copy(intersection.point).sub(this.position);
  };

  /** */
  clickDragged(intersection) {
	if (intersection) {
	  this.moveToPosition(
		intersection.point.sub(this.dragOffset),
		intersection);
	}
  };

  /** */
  rotate(intersection) {
	if (intersection) {
	  var angle = Utils.angle(
		0,
		1,
		intersection.point.x - this.position.x,
		intersection.point.z - this.position.z);

	  var snapTolerance = Math.PI / 16.0;

	  // snap to intervals near Math.PI/2
	  for (var i = -4; i <= 4; i++) {
		if (Math.abs(angle - (i * (Math.PI / 2))) < snapTolerance) {
		  angle = i * (Math.PI / 2);
		  break;
		}
	  }

	  this.rotation.y = angle;
	}
  }

  /** */
  moveToPosition(vec3, intersection) {
	this.position.copy(vec3);
  }

  /** */
  clickReleased() {
	if (this.error) {
	  this.hideError();
	}
  };

  /**
   * Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged
   */
  customIntersectionPlanes() {
	return [];
  }

  /** 
   * returns the 2d corners of the bounding polygon
   * 
   * offset is Vector3 (used for getting corners of object at a new position)
   * 
   * TODO: handle rotated objects better!
   */
  getCorners(xDim, yDim, position) {

	position = position || this.position;

	var halfSize = this.halfSize.clone();

	var c1 = new Vector3(-halfSize.x, 0, -halfSize.z);
	var c2 = new Vector3(halfSize.x, 0, -halfSize.z);
	var c3 = new Vector3(halfSize.x, 0, halfSize.z);
	var c4 = new Vector3(-halfSize.x, 0, halfSize.z);

	var transform = new Matrix4();
	//console.log(this.rotation.y);
	transform.makeRotationY(this.rotation.y); //  + Math.PI/2)

	c1.applyMatrix4(transform);
	c2.applyMatrix4(transform);
	c3.applyMatrix4(transform);
	c4.applyMatrix4(transform);

	c1.add(position);
	c2.add(position);
	c3.add(position);
	c4.add(position);

	//halfSize.applyMatrix4(transform);

	//var min = position.clone().sub(halfSize);
	//var max = position.clone().add(halfSize);

	var corners = [
	  { x: c1.x, y: c1.z },
	  { x: c2.x, y: c2.z },
	  { x: c3.x, y: c3.z },
	  { x: c4.x, y: c4.z }
	];

	return corners;
  }

  /** */
  isValidPosition(vec3){}

  /** */
  showError(vec3) {
	vec3 = vec3 || this.position;
	if (!this.error) {
	  this.error = true;
	  this.errorGlow = this.createGlow(this.errorColor, 0.8, true);
	  this.scene.add(this.errorGlow);
	}
	this.errorGlow.position.copy(vec3);
  }

  /** */
  hideError() {
	if (this.error) {
	  this.error = false;
	  this.scene.remove(this.errorGlow);
	}
  }

  /** */
  objectHalfSize() {
	var objectBox = new Box3();
	objectBox.setFromObject(this);
	return objectBox.max.clone().sub(objectBox.min).divideScalar(2);
  }

  /** */
  createGlow(color, opacity, ignoreDepth) {
	ignoreDepth = ignoreDepth || false
	opacity = opacity || 0.2;
	var glowMaterial = new MeshBasicMaterial({
	  color: color,
	  blending: AdditiveBlending,
	  opacity: 0.2,
	  transparent: true,
	  depthTest: !ignoreDepth
	});

	var glow = new Mesh(this.geometry.clone(), glowMaterial);
	glow.position.copy(this.position);
	glow.rotation.copy(this.rotation);
	glow.scale.copy(this.scale);
	return glow;
  };
}