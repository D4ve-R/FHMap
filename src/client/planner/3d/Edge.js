import { Utils } from '../core';
import { 
  Vector2,
  TextureLoader,
  RepeatWrapping,
  Vector3,
  MeshBasicMaterial,
  FrontSide,
  BackSide,
  DoubleSide,
  Shape,
  ShapeGeometry,
  Mesh,
  Path,
  BufferGeometry
} from 'three';

export class Edge {
	constructor (scene, edge, controls) {
		this.scene = scene;
		this.edge = edge;
		this.controls = controls;
		this.wall = edge.wall;
		this.front = edge.front;
	
		this.planes = [];
		this.basePlanes = []; // always visible
		this.texture = null;
	
		//this.lightMap = new TextureLoader().load("data/textures/walllightmap.png");
		this.fillerColor = 0xdddddd;
		this.sideColor = 0xcccccc;
		this.baseColor = 0xdddddd;
	
		this.visible = false;
	
		this.edge.redrawCallbacks.add(this.redraw.bind(this));
		this.controls.cameraMovedCallbacks?.add(this.updateVisibility.bind(this));
		this.updateTexture();
		this.updatePlanes();
		this.addToScene();
	}
	
	redraw() {
		this.removeFromScene();
		this.updateTexture();
		this.updatePlanes();
		this.addToScene();
	}

	remove() {
		this.edge.redrawCallbacks.remove(this.redraw);
		this.controls.cameraMovedCallbacks?.remove(this.updateVisibility);
		this.removeFromScene();
	}

	removeFromScene() {
		  this.planes.forEach((plane) => {
			this.scene.remove(plane);
		  });
		  this.basePlanes.forEach((plane) => {
			this.scene.remove(plane);
		  });
		  this.planes = [];
		  this.basePlanes = [];
	}
	
	addToScene() {
		  this.planes.forEach((plane) => {
			this.scene.add(plane);
		  });
		  this.basePlanes.forEach((plane) => {
			this.scene.add(plane);
		  });
		  this.updateVisibility();
	}
	
	updateVisibility() {
		  // finds the normal from the specified edge
		  var start = this.edge.interiorStart();
		  var end = this.edge.interiorEnd();
		  var x = end.x - start.x;
		  var y = end.y - start.y;
		  // rotate 90 degrees CCW
		  const normal = new Vector3(-y, 0, x).normalize();
	
		  // setup camera
		  var position = this.controls.object.position.clone();
		  var focus = new Vector3(
			(start.x + end.x) / 2.0,
			0,
			(start.y + end.y) / 2.0);
		  const direction = position.sub(focus).normalize();
	
		  // find dot
		  const dot = normal.dot(direction);
	
		  // update visible
		  this.visible = (dot >= 0);
	
		  // show or hide plans
		  this.planes.forEach((plane) => {
			plane.visible = this.visible;
		  });
	
		  this.updateObjectVisibility();
	}
	
	updateObjectVisibility() {
		  this.wall.items.forEach((item) => {
			item.updateEdgeVisibility(this.visible, front);
		  });
		  this.wall.onItems.forEach((item) => {
			item.updateEdgeVisibility(this.visible, front);
		  });
	}
	
	updateTexture(callback) {
		  // callback is fired when texture loads
		  callback = callback || function () {
			this.scene.needsUpdate = true;
		  }.bind(this);
		  const textureData = this.edge.getTexture();
		  const stretch = textureData.stretch;
		  const url = textureData.url;
		  const scale = textureData.scale;
		  this.texture = new TextureLoader().load(url, callback);
		  if (!stretch) {
			const height = this.wall.height;
			const width = this.edge.interiorDistance();
			this.texture.wrapT = RepeatWrapping;
			this.texture.wrapS = RepeatWrapping;
			this.texture.repeat.set(width / scale, height / scale);
			this.texture.needsUpdate = true;
		  }
	}
	
	updatePlanes() {
		const wallMaterial = new MeshBasicMaterial({
		color: 0xffffff,
		// ambientColor: 0xffffff,
		//ambient: this.wall.color,
		side: FrontSide,
		map: this.texture,
		// lightMap: lightMap
		});
	
		const fillerMaterial = new MeshBasicMaterial({
		color: this.fillerColor,
		side: DoubleSide
		});
	
		// exterior plane
		this.planes.push(this.makeWall(
		this.edge.exteriorStart(),
		this.edge.exteriorEnd(),
		this.edge.exteriorTransform,
		this.edge.invExteriorTransform,
		fillerMaterial));
	
		// interior plane
		this.planes.push(this.makeWall(
		this.edge.interiorStart(),
		this.edge.interiorEnd(),
		this.edge.interiorTransform,
		this.edge.invInteriorTransform,
		wallMaterial));
	
		// bottom
		// put into basePlanes since this is always visible
		this.basePlanes.push(this.buildFiller(
		this.edge, 0,
		BackSide, this.baseColor));
	
		// top
		this.planes.push(this.buildFiller(
		this.edge, this.wall.height,
		DoubleSide, this.fillerColor));
	
		// sides
		this.planes.push(this.buildSideFiller(
		this.edge.interiorStart(), this.edge.exteriorStart(),
		this.wall.height, this.sideColor));
	
		this.planes.push(this.buildSideFiller(
		this.edge.interiorEnd(), this.edge.exteriorEnd(),
		this.wall.height, this.sideColor));
	}
	
		// start, end have x and y attributes (i.e. corners)
	makeWall(start, end, transform, invTransform, material) {
		  const v1 = this.toVec3(start);
		  const v2 = this.toVec3(end);
		  const v3 = v2.clone();
		  v3.y = this.wall.height;
		  const v4 = v1.clone();
		  v4.y = this.wall.height;
	
		  const points = [v1.clone(), v2.clone(), v3.clone(), v4.clone()];
	
		  points.forEach((p) => {
			p.applyMatrix4(transform);
		  });
	
		  const shape = new Shape([
			new Vector2(points[0].x, points[0].y),
			new Vector2(points[1].x, points[1].y),
			new Vector2(points[2].x, points[2].y),
			new Vector2(points[3].x, points[3].y)
		  ]);
	
		  // add holes for each wall item
		  this.wall.items?.forEach((item) => {
			var pos = item.position.clone();
			pos.applyMatrix4(transform)
			var halfSize = item.halfSize;
			var min = halfSize.clone().multiplyScalar(-1);
			var max = halfSize.clone();
			min.add(pos);
			max.add(pos);
	
			var holePoints = [
			  new Vector2(min.x, min.y),
			  new Vector2(max.x, min.y),
			  new Vector2(max.x, max.y),
			  new Vector2(min.x, max.y)
			];
	
			shape.holes.push(new Path(holePoints));
		  });
	
		  const geometry = new ShapeGeometry(shape);
		  const array = geometry.getAttribute('position').array;
		  const vertices = [];
		  for(let i = 0; i < array.length; i+=3)
		  	 vertices.push(new Vector3(array[i], array[i+1], array[i+2]));
	
		  vertices.forEach((v) => {
			v.applyMatrix4(invTransform);
		  });
	
		  // make UVs
		  var totalDistance = Utils.distance(v1.x, v1.z, v2.x, v2.z);
		  var height = this.wall.height;
		  /*
		  geometry.faceVertexUvs[0] = [];
	
		  function vertexToUv(vertex) {
			var x = Utils.distance(v1.x, v1.z, vertex.x, vertex.z) / totalDistance;
			var y = vertex.y / height;
			return new Vector2(x, y);
		  }
	
		  geometry.faces.forEach((face) => {
			var vertA = geometry.vertices[face.a];
			var vertB = geometry.vertices[face.b];
			var vertC = geometry.vertices[face.c];
			geometry.faceVertexUvs[0].push([
			  vertexToUv(vertA),
			  vertexToUv(vertB),
			  vertexToUv(vertC)]);
		  });
	
		  geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0];
	
		  geometry.computeFaceNormals();
		  geometry.computeVertexNormals();
		  */
		 geometry.computeVertexNormals();
		  var mesh = new Mesh(
			geometry,
			material);
	
		  return mesh;
	}
	
	buildSideFiller(p1, p2, height, color) {
		  const points = [
			this.toVec3(p1),
			this.toVec3(p2),
			this.toVec3(p2, height),
			
			this.toVec3(p1),
			this.toVec3(p2, height),
			this.toVec3(p1, height)
		  ];
	
		  const geometry = new BufferGeometry().setFromPoints( points );
		  geometry.computeVertexNormals();
	
		  const fillerMaterial = new MeshBasicMaterial({
			color: color,
			side: DoubleSide
		  });
	
		  return new Mesh(geometry, fillerMaterial);
	}
	
	buildFiller(edge, height, side, color) {
		  const points = [
			this.toVec2(edge.exteriorStart()),
			this.toVec2(edge.exteriorEnd()),
			this.toVec2(edge.interiorEnd()),
			this.toVec2(edge.interiorStart())
		  ];
	
		  const fillerMaterial = new MeshBasicMaterial({
			color: color,
			side: side
		  });
	
		  const shape = new Shape(points);
		  const geometry = new ShapeGeometry(shape);
	
		  const filler = new Mesh(geometry, fillerMaterial);
		  filler.rotation.set(Math.PI / 2, 0, 0);
		  filler.position.y = height;
		  return filler;
	}
	
	toVec2(pos) {
		return new Vector2(pos.x, pos.y);
	}
	
	toVec3(pos, height) {
		height = height || 0;
		return new Vector3(pos.x, height, pos.y);
	}
}

