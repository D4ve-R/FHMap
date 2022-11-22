import { 
	WebGLRenderer,
	PerspectiveCamera,
	PCFSoftShadowMap,
	Vector3
} from 'three';
import { Utils } from '../core';
import { OrbitControls } from '../controller';
import { Floorplan3d, WebGL, Shader, Lights } from '../3d';

export class Viewer3d {
	constructor(elId, model, controller, controls) {
		this.fpModel = model.floorplan;
		this.domEl = document.getElementById(elId) || document.body;
		const width = this.domEl.clientWidth;
		const height = this.domEl.clientHeight;

		this.renderer = new WebGLRenderer({
			antialias: true,
			//preserveDrawingBuffer: true // required to support .toDataURL()
		});
		//this.renderer.debug.checkShaderErrors = false;

		this.renderer.autoClear = false,
        this.renderer.shadowMap.enabled = true;
      	//this.renderer.shadowMapSoft = true;
      	this.renderer.shadowMap.type = PCFSoftShadowMap;
		this.renderer.setSize( width, height );

		this.scene = model.scene.getScene();
		this.camera = new PerspectiveCamera( 65, width/height, 1, 15000 );
		this.orbit = controls || new OrbitControls(this.camera, this.renderer.domElement);
		this.controller = controller;
		this.lights = new Lights(this.scene, this.fpModel);
		//this.shader = new Shader(this.scene);

		this.domEl.appendChild( this.renderer.domElement );
		this.handleWindowResize();
		this.fpModel.fireOnUpdatedRooms(this.centerCamera.bind(this));

		window.addEventListener('resize', () => {
			this.handleWindowResize();
		});
		
		this.centerCamera();
	}

	render() {
		this.handleWindowResize();

		const animate = function () {
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
			if(this.controller) {
				this.renderer.clearDepth();
				this.renderer.render(this.controller.itemScene, this.camera);
			}
		}.bind(this);

		if ( WebGL.isWebGLAvailable() ) {
			this.renderer.setAnimationLoop(animate);
		
		} else {
			const warning = WebGL.getWebGLErrorMessage();
			this.domEl.appendChild(warning);
		}
	}

	centerCamera() {
		const center = this.fpModel.getCenter();
		center.y = 150.0;
		const distance = this.fpModel.getSize().z * 1.5;
		const pos = center.clone().add(new Vector3(0, distance, distance));
		this.camera.position.copy(pos);
		this.orbit.target.copy(center);
		this.orbit.update();
	}

	handleWindowResize() {
		this.heightMargin = Utils.offset(this.domEl).top;
		this.widthMargin = Utils.offset(this.domEl).left;
		this.domEl.style.height = window.innerHeight - this.heightMargin + "px";
		this.domEl.style.width = window.innerWidth - this.widthMargin + "px";
		this.renderer.setSize(this.domEl.clientWidth, this.domEl.clientHeight);
		this.camera.aspect = this.domEl.clientWidth / this.domEl.clientHeight;
		this.camera.updateProjectionMatrix();
	}; 

	cleanup() {	
		this.renderer.dispose();
		this.scene.dispose();
		this.camera.dispose();
		this.orbit.dispose();
	}
}
