import { Vector2, Shape, ShapeGeometry, Mesh, MeshBasicMaterial, DoubleSide} from 'three';
import { Utils, Callbacks } from "../core";
import { HalfEdge } from "./HalfEdges";

/** Default texture to be used if nothing is provided. */
const defaultRoomTexture = {
  url: "data/textures/gray-floor.png",
  scale: 400
}

/** 
 * A Room is the combination of a Floorplan with a floor plane. 
 */
export class Room {

  /** */
  interiorCorners = [];

  /** */
  edgePointer = null;

  /** floor plane for intersection testing */
  floorPlane = null;

  /** */
  customTexture = false;

  /** */
  floorChangeCallbacks = new Callbacks();

  /**
   *  ordered CCW
   */
  constructor(floorplan, corners) {
	this.floorplan = floorplan;
	this.corners = corners;
	this.updateWalls();
	this.updateInteriorCorners();
	this.generatePlane();
	this.level = corners[0].z || 0;
  }

  getUuid() {
	const cornerUuids = Utils.map(this.corners, function (c) {
	  return c.id;
	});
	cornerUuids.sort();
	return cornerUuids.join();
  }

  fireOnFloorChange(callback) {
	this.floorChangeCallbacks.add(callback);
  }

  getTexture() {
	const uuid = this.getUuid();
	const tex = this.floorplan.getFloorTexture(uuid);
	return tex || defaultRoomTexture;
  }

  /** 
   * textureStretch always true, just an argument for consistency with walls
   */
  setTexture(textureUrl, textureStretch, textureScale) {
	this.floorplan.setFloorTexture(this.getUuid(), textureUrl, textureScale);
	this.floorChangeCallbacks.fire();
  }

  generatePlane() {
	const points = [];
	this.interiorCorners.forEach((corner) => {
	  points.push(new Vector2(
		corner.x,
		corner.y));
	});
	const shape = new Shape(points);
	const geometry = new ShapeGeometry(shape);
	this.floorPlane = new Mesh(geometry,
	  new MeshBasicMaterial({
		side: DoubleSide
	  }));
	this.floorPlane.visible = false;
	this.floorPlane.rotation.set(Math.PI / 2, 0, 0);
	(this.floorPlane).room = this; // js monkey patch
  }

  cycleIndex(index) {
	if (index < 0) {
	  return index += this.corners.length;
	} else {
	  return index % this.corners.length;
	}
  }

  updateInteriorCorners() {
	let edge = this.edgePointer;
	let update = true;
	while (update) {
	  this.interiorCorners.push(edge.interiorStart());
	  edge.generatePlane();
	  if (edge.next === this.edgePointer) {
		update = false;
	  } else {
		edge = edge.next;
	  }
	}
  }

  /** 
   * Populates each wall's half edge relating to this room
   * this creates a fancy doubly connected edge list (DCEL)
   */
  updateWalls() {

	let prevEdge = null;
	let firstEdge = null;

	for (let i = 0; i < this.corners.length; i++) {

	  const firstCorner = this.corners[i];
	  const secondCorner = this.corners[(i + 1) % this.corners.length];

	  // find if wall is heading in that direction
	  const wallTo = firstCorner.wallTo(secondCorner);
	  const wallFrom = firstCorner.wallFrom(secondCorner);

	  let edge = null;
	  if (wallTo) {
		edge = new HalfEdge(this, wallTo, true);
	  } else if (wallFrom) {
		edge = new HalfEdge(this, wallFrom, false);
	  } else {
		console.error("Corners arent connected by a wall, uh oh");
	  }

	  if (i == 0) {
		firstEdge = edge;
	  } else {
		edge.prev = prevEdge;
		prevEdge.next = edge;
		if (i + 1 == this.corners.length) {
		  firstEdge.prev = edge;
		  edge.next = firstEdge;
		}
	  }
	  prevEdge = edge;
	}

	// hold on to an edge reference
	this.edgePointer = firstEdge;
  }

  getCenter() {
	let polygon = [];
	this.interiorCorners.forEach((corner) => {
		polygon.push([corner.x, corner.y]);
	});
	return Utils.getPolygonCenter(polygon);
  }	
}
  