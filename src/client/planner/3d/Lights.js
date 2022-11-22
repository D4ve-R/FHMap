
import { DirectionalLight, HemisphereLight } from "three";
import { Config } from "../core";

const height = 300;

export class Lights {
	constructor(scene, floorplan) {
		this.scene = scene;
		this.floorplan = floorplan;
		this.height = Config.getNumericValue("wallHeight") + 50;

		this.hemiLight = new HemisphereLight(0xffffff, 0x888888, 1.1);
		this.hemiLight.position.set(0, this.height, 0);

		this.dirLight = new DirectionalLight(0xffffff, 0.0);
		this.dirLight.color.setHSL(1, 1, 0.1);
		this.dirLight.castShadow = true;

		const shadow = this.dirLight.shadow;
		shadow.mapWidth = 1024;
		shadow.mapHeight = 1024;
		shadow.camera.far = height;
		shadow.bias = -0.0001;
		shadow.darkness = 0.35;

		this.dirLight.visible = true;
		shadow.camera.visible = false;

		this.floorplan.fireOnUpdatedRooms(this.updateLights.bind(this));

		this.scene.add(this.hemiLight);
		this.scene.add(this.dirLight);
		this.scene.add(this.dirLight.target);
	}

	updateLights() {
		const size = this.floorplan.getSize();
		const d = Math.max(size.x, size.y) / 2.0;
		const center = this.floorplan.getCenter();
		const dirLight = this.dirLight;
		dirLight.position.set(center.x, height, center.z);
		dirLight.target.position.set(center.x, 0, center.z);
		dirLight.shadow.cameraLeft = -d;
      	dirLight.shadow.cameraRight = d;
      	dirLight.shadow.cameraTop = d;
      	dirLight.shadow.cameraBottom = -d;
		if (dirLight.shadow.camera) {
			const shadow = this.dirLight.shadow;
			const camera = this.dirLight.shadow.camera;
			camera.left = shadow.cameraLeft;
      		camera.right = shadow.cameraRight;
      		camera.top = shadow.cameraTop;
      		camera.bottom = shadow.cameraBottom;
			camera.updateProjectionMatrix();
		}
	}
}