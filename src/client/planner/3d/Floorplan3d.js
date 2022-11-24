import { Floor } from "./Floor";
import { Room } from "./Room";
import { Edge } from "./Edge";
import { OBJExporter } from "./OBJExporter";

export class Floorplan3d { 
	constructor(scene, floorplan, controls) {
    	this.scene = scene;
    	this.floorplan = floorplan;
    	this.controls = controls;
    	this.floors = [];
    	this.edges = [];
		this.rooms = [];

    	this.floorplan.fireOnUpdatedRooms(this.redraw.bind(this));
	}

    redraw() {
      // clear scene
      this.floors.forEach((floor) => {
        floor.removeFromScene();
      });

	  this.rooms.forEach((room) => {
        room.removeFromScene();
      });

      this.edges.forEach((edge) => {
        edge.remove();
      });
      this.floors = [];
      this.edges = [];

      // draw floors
     this.floorplan.getRooms().forEach((room) => {
        const threeFloor = new Floor(this.scene, room);
		const threeRoom = new Room(this.scene, room);
        this.floors.push(threeFloor);
		this.rooms.push(threeRoom);
        threeFloor.addToScene();
		threeRoom.addToScene();
      });

      // draw edges
      this.floorplan.wallEdges().forEach((edge) => {
        const threeEdge = new Edge(
          this.scene, edge, this.controls);
        this.edges.push(threeEdge);
      });
    }

	exportOBJ() {
		const exporter = new OBJExporter();
		const obj = exporter.parse(this.scene);
		return obj;
	}
}
