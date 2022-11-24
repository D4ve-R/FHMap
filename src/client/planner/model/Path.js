import { Utils } from '../core';

export class Path {
	constructor(floorplan, corners) {
	this.floorplan = floorplan;
	this.corners = corners;
	this.updateWalls();
	this.updateInteriorCorners();
	this.generatePlane();
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
	return tex;
  }
}