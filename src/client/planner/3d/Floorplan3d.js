import { Floor } from "./Floor";
import { Edge } from "./Edge";

export class Floorplan3d { 
	constructor(scene, floorplan, controls) {
    	this.scene = scene;
    	this.floorplan = floorplan;
    	this.controls = controls;
    	this.floors = [];
    	this.edges = [];

    	this.floorplan.fireOnUpdatedRooms(this.redraw.bind(this));
	}

    redraw() {
      // clear scene
      this.floors.forEach((floor) => {
        floor.removeFromScene();
      });

      this.edges.forEach((edge) => {
        edge.remove();
      });
      this.floors = [];
      this.edges = [];

      // draw floors
     this.floorplan.getRooms().forEach((room) => {
        const threeFloor = new Floor(this.scene, room);
        this.floors.push(threeFloor);
        threeFloor.addToScene();
      });

      // draw edges
      this.floorplan.wallEdges().forEach((edge) => {
        const threeEdge = new Edge(
          this.scene, edge, this.controls);
        this.edges.push(threeEdge);
      });
    }
}
