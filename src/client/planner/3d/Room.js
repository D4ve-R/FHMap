import { 
	Vector2,  
	RepeatWrapping, 
	MeshPhongMaterial,
	MeshBasicMaterial,
	//Color,
	DoubleSide,
	FrontSide,
	Shape,
	Mesh,
	TextureLoader,
	ExtrudeGeometry
	//BufferGeometry
} from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
import { Config, configWallHeight } from '../core';

import * as font from 'three/examples/fonts/helvetiker_regular.typeface.json';

export class Room {
	constructor(scene, room) {
		this.room = room;
		this.scene = scene;
		this.wallHeight = Config.getNumericValue(configWallHeight)
	
		this.room.fireOnFloorChange(this.redraw.bind(this));
		this.roomObj = this.buildRoom();
	}
	
	redraw() {
		this.removeFromScene();
		this.roomObj = this.buildRoom();
		this.roomObj.add(this.getText());
		this.addToScene();
	}
	
	buildRoom() {
		const roomMaterial = new MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.5,
		});

		const textureScale = 1;

		let points = [];
		this.room.interiorCorners.forEach((corner) => {
		points.push(new Vector2(
		  corner.x / textureScale,
		  corner.y / textureScale));
		});

		const shape = new Shape(points);

		const height = this.wallHeight - 30;

		const geometry = new ExtrudeGeometry(shape, {
			depth: height,
			bevelEnabled: false,
		});

		const room = new Mesh(geometry, roomMaterial);

		room.rotation.set(Math.PI / 2, 0, 0);
		room.position.y += height + 1 + ((this.room.level) * this.wallHeight);
		room.castShadow = false;
		room.name = 'room';
		return room;
	}
	
	addToScene() {
		this.scene.add(this.roomObj);
		//scene.add(roofPlane);
		// hack so we can do intersect testing
		this.scene.add(this.room.floorPlane);
	}
	
	removeFromScene() {
		this.scene.remove(this.roomObj);
		//scene.remove(roofPlane);
		this.scene.remove(this.room.floorPlane);
	}

	getText() {
		const geometry = new TextGeometry( "this.room.name", {
			font: 'helvetiker',
			size: 20,
			height: 0.5
		});
		geometry.center();
		const material = new MeshBasicMaterial( { color: 0xff0000 } );
		const mesh = new Mesh( geometry, material );
		mesh.position.y += 0.5;
		return mesh;
	}

	setOpacity(opacity) {
		this.roomObj.material.opacity = opacity % 1;
	}

	mouseOver() {
		this.hover = true;
		this.updateHighlight();
	};
	
	  /** */
	mouseOff() {
		this.hover = false;
		this.updateHighlight();
	};

	updateHighlight() {
		this.setOpacity(this.hover ? 0.6 : 0.1);
	}
}