import { 
	Vector2,  
	RepeatWrapping, 
	MeshPhongMaterial, 
	DoubleSide,
	FrontSide,
	Shape,
	ShapeGeometry,
	Mesh,
	TextureLoader,
} from 'three';

export class Floor {
	constructor(scene, room) {
		this.room = room;
		this.scene = scene;
	
		this.room.fireOnFloorChange(this.redraw.bind(this));
		this.floorPlane = this.buildFloor();
		// roofs look weird, so commented out
		//this.roofPlane = this.buildRoof();
	}
	
	redraw() {
		this.removeFromScene();
		this.floorPlane = buildFloor();
		this.addToScene();
	}
	
	buildFloor() {
		var textureSettings = this.room.getTexture();
		// setup texture
		var floorTexture = new TextureLoader().load(textureSettings.url);
		floorTexture.wrapS = RepeatWrapping;
		floorTexture.wrapT = RepeatWrapping;
		floorTexture.repeat.set(1, 1);
		var floorMaterialTop = new MeshPhongMaterial({
			map: floorTexture,
			side: DoubleSide,
			// ambient: 0xffffff, TODO_Ekki
			color: 0xcccccc,
			specular: 0x0a0a0a
		});

		var textureScale = textureSettings.scale;
		// http://stackoverflow.com/questions/19182298/how-to-texture-a-three-js-mesh-created-with-shapegeometry
		// scale down coords to fit 0 -> 1, then rescale

		const points = [];
		this.room.interiorCorners.forEach((corner) => {
		points.push(new Vector2(
		  corner.x / textureScale,
		  corner.y / textureScale));
		});
		const shape = new Shape(points);

		const geometry = new ShapeGeometry(shape);

		const floor = new Mesh(geometry, floorMaterialTop);

		floor.rotation.set(Math.PI / 2, 0, 0);
		floor.scale.set(textureScale, textureScale, textureScale);
		floor.receiveShadow = true;
		floor.castShadow = false;
		return floor;
	}
	
	buildRoof() {
		// setup texture
		var roofMaterial = new MeshBasicMaterial({
			side: FrontSide,
			color: 0xe5e5e5
		});

		var points = [];
		this.room.interiorCorners.forEach((corner) => {
		points.push(new Vector2(
		  corner.x,
		  corner.y));
		});
		var shape = new Shape(points);
		var geometry = new ShapeGeometry(shape);
		var roof = new Mesh(geometry, roofMaterial);

		roof.rotation.set(Math.PI / 2, 0, 0);
		roof.position.y = 250;
		return roof;
	}
	
	addToScene() {
		this.scene.add(this.floorPlane);
		//scene.add(roofPlane);
		// hack so we can do intersect testing
		this.scene.add(this.room.floorPlane);
	}
	
	removeFromScene() {
		this.scene.remove(this.floorPlane);
		//scene.remove(roofPlane);
		this.scene.remove(this.room.floorPlane);
	}

}