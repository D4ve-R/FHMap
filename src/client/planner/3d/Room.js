import { 
	Vector2,  
	RepeatWrapping, 
	MeshPhongMaterial,
	MeshBasicMaterial,
	//Color,
	DoubleSide,
	FrontSide,
	Shape,
	Mesh,
	TextureLoader,
	ExtrudeGeometry
	//BufferGeometry
} from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
import { Config, configWallHeight } from '../core';

import * as font from 'three/examples/fonts/helvetiker_regular.typeface.json';

export class Room extends Mesh {
	constructor(scene, room, view) {
		super();
		this.room = room;
		this.scene = scene;
		this.view = view;
		this.wallHeight = Config.getNumericValue(configWallHeight)
	
		this.room.fireOnFloorChange(this.redraw.bind(this));
		this.view.controls.cameraMovedCallbacks.add(this.updateVisibility.bind(this));
		this.buildRoom();
		this.material = new MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.1,
		});

		this.updateVisibility();
	}
	
	redraw() {
		this.removeFromScene();
		this.buildRoom();
		this.add(this.getText());
		this.addToScene();
	}
	
	buildRoom() {
		let points = [];
		this.room.interiorCorners.forEach((corner) => {
		points.push(new Vector2(
		  corner.x,
		  corner.y));
		});

		const shape = new Shape(points);

		const height = this.wallHeight - 30;

		const geometry = new ExtrudeGeometry(shape, {
			depth: height,
			bevelEnabled: false,
		});

		this.geometry = geometry;
		this.rotation.set(Math.PI / 2, 0, 0);
		this.position.y += height + 1 + ((this.room.level) * this.wallHeight);
		this.castShadow = false;
		this.name = 'room';
		return;
	}
	
	addToScene() {
		this.scene.add(this);
	}
	
	removeFromScene() {
		this.scene.remove(this);
	}

	getText() {
		const geometry = new TextGeometry( "this.room.name", {
			font: 'helvetiker',
			size: 20,
			height: 0.5
		});
		geometry.center();
		const material = new MeshBasicMaterial( { color: 0xff0000 } );
		const mesh = new Mesh( geometry, material );
		mesh.position.y += 0.5;
		return mesh;
	}

	setOpacity(opacity) {
		this.material.opacity = opacity % 1;
	}

	mouseOver() {
		this.hover = true;
		this.updateHighlight();
	};
	
	  /** */
	mouseOff() {
		this.hover = false;
		this.updateHighlight();
	};
	
	setSelected() {
		this.selected = true;
		this.updateHighlight();
	  };
	
	  setUnselected() {
		this.selected = false;
		this.updateHighlight();
	  };

	updateHighlight() {
		this.setOpacity(this.hover ? 0.6 : 0.1);
	}

	updateVisibility() {
		const visible = this.room.level === this.view.level;
		this.visible = visible;
	}

	clickPressed() {
		console.log('clickPressed');
	}

	clickReleased() {
		console.log('clickReleased');
		const popUp = document.createElement('div');
		popUp.id = 'popUp';
		popUp.classList.add('pop-up');

		const closeBtn = document.createElement('button');
		closeBtn.classList.add('pop-up-closebtn');
		closeBtn.onclick = () => {
			popUp.style.display = 'none';
			popUp.remove();
		}
		closeBtn.innerHTML = '&times;';
		popUp.appendChild(closeBtn);

		const content = document.createElement('div');
		content.classList.add('pop-up-content');
		const p = document.createElement('p');
		p.innerHTML = 'Room Name: ' + this.room.name;
		content.appendChild(p);
		popUp.appendChild(content);
		
		popUp.style.display = 'block';
		document.body.appendChild(popUp);
	}
}