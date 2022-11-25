import { 
	WebGLRenderer,
	PerspectiveCamera,
	PCFSoftShadowMap,
	Vector3
} from 'three';
import { Utils } from '../core';
import { OrbitControls } from '../controller';
import { WebGL, Lights } from '../3d';

export class Viewer3d {
	level = 0;

	constructor(elId, model, controller, controls) {
		this.fpModel = model.floorplan;
		this.domEl = document.getElementById(elId) || document.body;
		const width = this.domEl.clientWidth;
		const height = this.domEl.clientHeight;

		const levelControl = document.createElement('input');
		levelControl.type = 'number';
		levelControl.id = 'levelControl';
		levelControl.value = 0;

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
		this.controls = controls || new OrbitControls(this.camera, this.renderer.domElement);
		this.controller = controller;
		this.lights = new Lights(this.scene, this.fpModel);
		//this.shader = new Shader(this.scene);

		levelControl.addEventListener('change', function(e) {
			this.setLevel(parseInt(e.target.value));
			this.centerCamera();
		}.bind(this));
		this.domEl.appendChild(levelControl);
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
		center.y = 150.0 + (this.level * 250);
		const distance = this.fpModel.getSize().z * 1.5;
		const pos = center.clone().add(new Vector3(0, distance, distance));
		this.camera.position.copy(pos);
		this.controls.target.copy(center);
		this.controls.update();
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
		this.controls.dispose();
	}

	setLevel(level) {
		this.level = level;
		return this.level;
	}

	getLevel() {
		return this.level;
	}
}
