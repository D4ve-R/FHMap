// <reference path="../items/factory.ts" />

import { Utils, Callbacks } from '../core';
import { Scene, Color } from 'three';

	/**
	 * The Scene is a manager of Items and also links to a ThreeJS scene.
	 */
export class SceneM {

  /** */
  items = [];

  /** */
  needsUpdate = false;

  /** */
  itemLoadingCallbacks = new Callbacks();

  /** Item */
  itemLoadedCallbacks = new Callbacks();

  /** Item */
  itemRemovedCallbacks = new Callbacks();

  /**
   * Constructs a scene.
   * @param model The associated model.
   * @param textureDir The directory from which to load the textures.
   */
  constructor(model, textureDir, bgColor) {
	bgColor = bgColor || 0x000000;
	this.scene = new Scene();
	this.scene.background = new Color( bgColor );
	this.model = model;
	this.textureDir = textureDir;

	// init item loader
	//this.loader = new JSONLoader();
	//this.loader.crossOrigin = "";
  }

  /** Adds a non-item, basically a mesh, to the scene.
   * @param mesh The mesh to be added.
   */
  add(mesh) {
	this.scene.add(mesh);
  }

  /** Removes a non-item, basically a mesh, from the scene.
   * @param mesh The mesh to be removed.
   */
  remove(mesh) {
	this.scene.remove(mesh);
	Utils.removeValue(this.items, mesh);
  }

  /** Gets the scene.
   * @returns The scene.
   */
  getScene() {
	return this.scene;
  }

  /** Gets the items.
   * @returns The items.
   */
  getItems() {
	return this.items;
  }

  /** Gets the count of items.
   * @returns The count.
   */
  itemCount() {
	return this.items.length
  }

  /** Removes all items. */
  clearItems() {
	var scope = this;
	this.items.forEach((item) => {
	  scope.removeItem(item, true);
	});
	this.items = []
  }

  /**
   * Removes an item.
   * @param item The item to be removed.
   * @param dontRemove If not set, also remove the item from the items list.
   */
  removeItem(item, dontRemove) {
	dontRemove = dontRemove || false;
	// use this for item meshes
	this.itemRemovedCallbacks.fire(item);
	item.removed();
	this.scene.remove(item);
	if (!dontRemove) {
	  Utils.removeValue(this.items, item);
	}
  }

  /**
   * Creates an item and adds it to the scene.
   * @param itemType The type of the item given by an enumerator.
   * @param fileName The name of the file to load.
   * @param metadata TODO
   * @param position The initial position.
   * @param rotation The initial rotation around the y axis.
   * @param scale The initial scaling.
   * @param fixed True if fixed.
   */
  addItem(itemType, fileName, metadata, position, rotation, scale, fixed) {
	itemType = itemType || 1;
	var scope = this;
	var loaderCallback = function (geometry, materials) {
	  var item = new (Items.Factory.getClass(itemType))(
		scope.model,
		metadata, geometry,
		new THREE.MeshFaceMaterial(materials),
		position, rotation, scale
	  );
	  item.fixed = fixed || false;
	  scope.items.push(item);
	  scope.add(item);
	  item.initObject();
	  scope.itemLoadedCallbacks.fire(item);
	}

	this.itemLoadingCallbacks.fire();
	this.loader.load(
	  fileName,
	  loaderCallback,
	  undefined // TODO_Ekki 
	);
  }
}