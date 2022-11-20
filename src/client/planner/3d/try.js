import { WebGLRenderer,
	PerspectiveCamera,
	Scene,
	Vector2,
	Raycaster,
	Mesh,
	PlaneGeometry,
	MeshBasicMaterial,
	Vector3,
	GridHelper,
	DoubleSide
} from 'three';
import { OrbitControls } from './OrbitControls';
import WebGL from './WebGL';

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
const orbit = new OrbitControls(camera, renderer.domElement);

document.body.appendChild( renderer.domElement );

camera.position.set(0,2,0);
camera.rotation.x += Math.PI /2;
orbit.update();

const planeWidth = 2;
const planeHeight = planeWidth;

const planeMesh = new Mesh( 
	new PlaneGeometry( planeHeight, planeWidth ), 
	new MeshBasicMaterial({
		color: 0x00ff00,
		side: DoubleSide,
		visible: false
	})
);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y -= 0.01;
planeMesh.name = 'plane';
scene.add(planeMesh);

const gridSize = 0.1;
const division = planeWidth * (1 / gridSize);
const grid = new GridHelper( planeWidth, division, 0x0000ff, 0x808080 );
scene.add(grid);

const highlightMesh = new Mesh( 
	new PlaneGeometry( gridSize, gridSize ), 
	new MeshBasicMaterial({
		color: 0xf0ff00,
		side: DoubleSide
	})
);
highlightMesh.rotation.x = -Math.PI / 2;
highlightMesh.position.set(-gridSize/2, 0, -gridSize/2);
scene.add(highlightMesh);

const raycaster = new Raycaster();
const mousePos = new Vector2();
const onMouseMove = (e) => {
	e.preventDefault();
	mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mousePos, camera);
	let intersects = raycaster.intersectObjects(scene.children);
	for(let intersect in intersects) {
		if(intersect.object.name === 'plane') {
			const highlightPos = new Vector3().copy(intersect.point).floor().addScalar(0.5);
			highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
			break;
		}
	}
};

window.addEventListener('mousemove', onMouseMove);


const animate = () => {
	renderer.render(scene, camera);
};

if ( WebGL.isWebGLAvailable() ) {
	renderer.setAnimationLoop(animate);

} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild(warning);
}
