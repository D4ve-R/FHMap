import { 
	WebGLRenderer,
	PerspectiveCamera,
	Scene,
	PCFSoftShadowMap,
	Color,
	Vector3
} from 'three';
import { Utils } from './core';
import { OrbitControls } from './controller';
import { Floorplan3d, WebGL, Shader } from './3d';

export class Viewer3d {
	constructor(fpModel, elId) {
		this.fpModel = fpModel;
		this.domEl = document.getElementById(elId) || document.body;
		const width = this.domEl.clientWidth;
		const height = this.domEl.clientHeight;

		this.renderer = new WebGLRenderer({
			antialias: true,
			//preserveDrawingBuffer: true // required to support .toDataURL()
		});
		//this.renderer.debug.checkShaderErrors = false;

		//this.renderer.autoClear = false,
        this.renderer.shadowMap.enabled = true;
      	this.renderer.shadowMapSoft = true;
      	this.renderer.shadowMap.type = PCFSoftShadowMap;
		this.renderer.setSize( width, height );

		this.scene = new Scene();
		this.scene.background = new Color( 0x000000 );
		this.camera = new PerspectiveCamera( 65, width/height, 1, 10000 );
		this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
		this.shader = new Shader(this.scene);

		this.domEl.appendChild( this.renderer.domElement );
		this.handleWindowResize();
		this.fpModel.fireOnUpdatedRooms(this.centerCamera.bind(this));

		window.addEventListener('resize', () => {
			this.handleWindowResize();
		});

		this.floorplan = new Floorplan3d(this.scene, fpModel, this.orbit);
		this.centerCamera();
	}

	render() {
		this.handleWindowResize();

		const animate = function () {
			this.renderer.render(this.scene, this.camera);
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
		this.domEl.style.height = window.innerHeight - Utils.offset(this.domEl).top + "px";
		this.domEl.style.width = window.innerWidth - Utils.offset(this.domEl).left + "px";
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