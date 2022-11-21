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
		const store = document.getElementById('store') || document.createElement('button');
		const fileInput = document.getElementById('file') || document.createElement('input');
		const exportBtn = document.getElementById('export') || document.createElement('button');
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
		this.camera = new PerspectiveCamera( 65, width/height, 1, 15000 );
		this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
		//this.shader = new Shader(this.scene);

		this.domEl.appendChild( this.renderer.domElement );
		this.handleWindowResize();
		this.fpModel.fireOnUpdatedRooms(this.centerCamera.bind(this));
		this.floorplan = new Floorplan3d(this.scene, fpModel, this.orbit);

		window.addEventListener('resize', () => {
			this.handleWindowResize();
		});
		
		store.addEventListener('click', function() {
			const fp = this.fpModel.saveFloorplan();
			const data = JSON.stringify(fp);
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
			link.download = 'floorplan.json';
			link.click();
		}.bind(this));

		exportBtn.addEventListener('click', function() {
			const data = this.floorplan.exportOBJ();
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
			link.download = 'floorplan.obj';
			link.click();
		}.bind(this));

		fileInput.addEventListener('change', function() {
			const file = fileInput.files[0];
			const reader = new FileReader();
			reader.onload = function(e) {
				const data = e.target.result;
				const fp = JSON.parse(data);
				this.fpModel.loadFloorplan(fp);
			}.bind(this);
			reader.readAsText(file);
		}.bind(this));
		
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