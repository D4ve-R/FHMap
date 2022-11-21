import {
	Mesh,
	ShaderMaterial,
	SphereGeometry,
	Color,
	BackSide
} from 'three';

const vertexShader = [
	"varying vec3 vWorldPosition;",
	"void main() {",
	"  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
	"  vWorldPosition = worldPosition.xyz;",
	"  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	"}"
  ].join('\n');

  const fragmentShader = [
	"uniform vec3 topColor;",
	"uniform vec3 bottomColor;",
	"uniform float offset;",
	"varying vec3 vWorldPosition;",
	"void main() {",
	"  float h = normalize( vWorldPosition + offset ).y;",
	"  gl_FragColor = vec4( mix( bottomColor, topColor, (h + 1.0) / 2.0), 1.0 );",
	"}"
  ].join('\n');


export class Shader {
	constructor(scene) {
		this.scene = scene;

		this.topColor = 0xf0f0f0;//0xD8ECF9
    	this.bottomColor = 0x090909; //0xf9f9f9;//0x565e63
    	this.verticalOffset = 500
    	this.sphereRadius = 5000
    	this.widthSegments = 32
    	this.heightSegments = 15

		const uniforms = {
			topColor: {
			  type: "c",
			  value: new Color(this.topColor)
			},
			bottomColor: {
			  type: "c",
			  value: new Color(this.bottomColor)
			},
			offset: {
			  type: "f",
			  value: this.verticalOffset
			}
		}

		const sphere = new SphereGeometry(this.sphereRadius, this.widthSegments, this.heightSegments);
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			side: BackSide
		});
	
		this.mesh = new Mesh(sphere, material);
		this.addToScene();
	}

	addToScene() {
		this.scene.add(this.mesh);
	}
	
	removeFromScene() {
		this.scene.remove(this.mesh);
	}
}
