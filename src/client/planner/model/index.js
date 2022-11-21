import { Corner } from './Corner';
import { Room } from './Room';
import { Wall } from './Wall';
import { HalfEdge } from './HalfEdges';
import { Floorplan } from './Floorplan';
import { SceneM } from './Scene';
import { Callbacks } from '../core';
import { Vector3 } from 'three';

export default class Model {
  /** */
  roomLoadingCallbacks = new Callbacks();

  /** */
  roomLoadedCallbacks = new Callbacks();

  /** name */
  roomSavedCallbacks = new Callbacks();

  /** success (bool), copy (bool) */
  roomDeletedCallbacks = new Callbacks();

  /** Constructs a new model.
   * @param textureDir The directory containing the textures.
   */
  constructor(textureDir) {
	this.floorplan = new Floorplan();
	this.scene = new SceneM(this, textureDir);
  }

  loadSerialized(json) {
	// TODO: better documentation on serialization format.
	// TODO: a much better serialization format.
	this.roomLoadingCallbacks.fire();

	var data = JSON.parse(json)
	this.newRoom(
	  data.floorplan,
	  data.items
	);

	this.roomLoadedCallbacks.fire();
  }

  exportSerialized() {
	const items_arr = [];
	const objects = this.scene.getItems();
	for (var i = 0; i < objects.length; i++) {
	  const object = objects[i];
	  items_arr[i] = {
		item_name: object.metadata.itemName,
		item_type: object.metadata.itemType,
		model_url: object.metadata.modelUrl,
		xpos: object.position.x,
		ypos: object.position.y,
		zpos: object.position.z,
		rotation: object.rotation.y,
		scale_x: object.scale.x,
		scale_y: object.scale.y,
		scale_z: object.scale.z,
		fixed: object.fixed
	  };
	}

	var room = {
	  floorplan: (this.floorplan.saveFloorplan()),
	  items: items_arr
	};

	return JSON.stringify(room);
  }

  newRoom(floorplan, items) {
	this.scene.clearItems();
	this.floorplan.loadFloorplan(floorplan);
	items.forEach((item) => {
	  var position = new Vector3(
		item.xpos, item.ypos, item.zpos);
	  var metadata = {
		itemName: item.item_name,
		resizable: item.resizable,
		itemType: item.item_type,
		modelUrl: item.model_url
	  };
	  var scale = new Vector3(
		item.scale_x,
		item.scale_y,
		item.scale_z
	  );
	  this.scene.addItem(
		item.item_type,
		item.model_url,
		metadata,
		position,
		item.rotation,
		scale,
		item.fixed);
	});
  }
}

export { Corner, HalfEdge, Room, Wall, Floorplan };
