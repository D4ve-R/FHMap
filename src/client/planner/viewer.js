import { 
	WebGLRenderer,
	PerspectiveCamera,
	Scene,
	PCFSoftShadowMap,
} from 'three';
import { OrbitControls } from './controller';
import { Floorplan3d, WebGL } from './3d';

export class Viewer3d {
	constructor(fpModel ) {

		this.renderer = new WebGLRenderer({
			antialias: true,
			preserveDrawingBuffer: true // required to support .toDataURL()
		});
		this.initRenderer();

		this.scene = new Scene();
		this.camera = new PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.1, 1000 );
		this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
		this.floorplan = new Floorplan3d(this.scene, fpModel, this.orbit);

		document.getElementById('viewer').appendChild( this.renderer.domElement );
	}

	initRenderer(){
		this.renderer.autoClear = false,
        this.renderer.shadowMap.enabled = true;
      	this.renderer.shadowMapSoft = true;
      	this.renderer.shadowMap.type = PCFSoftShadowMap;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	render() {
		const animate = function () {
			requestAnimationFrame( animate )
			this.renderer.render(this.scene, this.camera);
		}.bind(this);

		if ( WebGL.isWebGLAvailable() ) {
			this.renderer.setAnimationLoop(animate);
		
		} else {
			const warning = WebGL.getWebGLErrorMessage();
			document.body.appendChild(warning);
		}
	}
}