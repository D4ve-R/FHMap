import { Utils, Callbacks } from "../core";
import { FloorPlanView, floorplannerModes } from "../view";

export class FloorplanControl {
    mode = 0;
	activeWall = null;
	activeCorner = null;
	originX = 0;
	originY = 0;
	targetX = 0;
	targetY = 0;
	lastNode = null;
	wallWidth = 0.1;
	modeResetCallbacks = new Callbacks();
	canvasElement;
	mouseDown = false;
	mouseMoved = false;
	mouseX = 0;
	mouseY = 0;
	rawMouseX = 0;
	rawMouseY = 0;
	lastX = 0;
	lastY = 0;
	snapTolerance = 25;

    /** */
    constructor(canvasId, floorplan) {
		this.floorplan = floorplan;

      this.canvasElement = document.getElementById(canvasId);

      this.view = new FloorPlanView(this.floorplan, this, canvasId);

      const cmPerFoot = 30.48;
      const pixelsPerFoot = 15.0;
      this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
      this.pixelsPerCm = 1.0 / this.cmPerPixel;

      this.wallWidth = 10.0 * this.pixelsPerCm;

      // Initialization:

      this.setMode(floorplannerModes.MOVE);

      const scope = this;

      this.canvasElement.addEventListener('mousedown', () => {
        scope.mousedown();
      });
      this.canvasElement.addEventListener('mousemove', (event) => {
        scope.mousemove(event);
      });
      this.canvasElement.addEventListener('mouseup', () => {
        scope.mouseup();
      });
      this.canvasElement.addEventListener('mouseleave', () => {
        scope.mouseleave();
      });

	  window.addEventListener('keydown', (e) => {
		if (e.code === "Escape") {
			scope.escapeKey();
		}
	  });
					

      this.floorplan.roomLoadedCallbacks.add(() => {
        scope.reset()
      });
    }

    escapeKey() {
      this.setMode(floorplannerModes.MOVE);
    }

    updateTarget() {
      if (this.mode == floorplannerModes.DRAW && this.lastNode) {
        if (Math.abs(this.mouseX - this.lastNode.x) < this.snapTolerance) {
          this.targetX = this.lastNode.x;
        } else {
          this.targetX = this.mouseX;
        }
        if (Math.abs(this.mouseY - this.lastNode.y) < this.snapTolerance) {
          this.targetY = this.lastNode.y;
        } else {
          this.targetY = this.mouseY;
        }
      } else {
        this.targetX = this.mouseX;
        this.targetY = this.mouseY;
      }

      this.view.draw();
    }

    mousedown() {
      this.mouseDown = true;
      this.mouseMoved = false;
      this.lastX = this.rawMouseX;
      this.lastY = this.rawMouseY;

      // delete
      if (this.mode == floorplannerModes.DELETE) {
        if (this.activeCorner) {
          this.activeCorner.removeAll();
        } else if (this.activeWall) {
          this.activeWall.remove();
        } else {
          this.setMode(floorplannerModes.MOVE);
        }
      }
    }

    mousemove(event) {
      this.mouseMoved = true;

      // update mouse
      this.rawMouseX = event.clientX;
      this.rawMouseY = event.clientY;

	  const offset = Utils.offset(this.canvasElement);

      this.mouseX = (this.rawMouseX - offset.left) * this.cmPerPixel + this.originX * this.cmPerPixel;
      this.mouseY = (this.rawMouseY - offset.top) * this.cmPerPixel + this.originY * this.cmPerPixel;

      // update target (snapped position of actual mouse)
      if (this.mode == floorplannerModes.DRAW || (this.mode == floorplannerModes.MOVE && this.mouseDown)) {
        this.updateTarget();
      }

      // update object target
      if (this.mode != floorplannerModes.DRAW && !this.mouseDown) {
        const hoverCorner = this.floorplan.overlappedCorner(this.mouseX, this.mouseY);
        const hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
        let draw = false;
        if (hoverCorner != this.activeCorner) {
          this.activeCorner = hoverCorner;
          draw = true;
        }
        // corner takes precendence
        if (this.activeCorner == null) {
          if (hoverWall != this.activeWall) {
            this.activeWall = hoverWall;
            draw = true;
          }
        } else {
          this.activeWall = null;
        }
        if (draw) {
          this.view.draw();
        }
      }

      // panning
      if (this.mouseDown && !this.activeCorner && !this.activeWall) {
        this.originX += (this.lastX - this.rawMouseX);
        this.originY += (this.lastY - this.rawMouseY);
        this.lastX = this.rawMouseX;
        this.lastY = this.rawMouseY;
        this.view.draw();
      }

      // dragging
      if (this.mode == floorplannerModes.MOVE && this.mouseDown) {
        if (this.activeCorner) {
          this.activeCorner.move(this.mouseX, this.mouseY);
          this.activeCorner.snapToAxis(this.snapTolerance);
        } else if (this.activeWall) {
          this.activeWall.relativeMove(
            (this.rawMouseX - this.lastX) * this.cmPerPixel,
            (this.rawMouseY - this.lastY) * this.cmPerPixel
          );
          this.activeWall.snapToAxis(this.snapTolerance);
          this.lastX = this.rawMouseX;
          this.lastY = this.rawMouseY;
        }
        this.view.draw();
      }
    }

    mouseup() {
      this.mouseDown = false;

      // drawing
      if (this.mode == floorplannerModes.DRAW && !this.mouseMoved) {
        const corner = this.floorplan.newCorner(this.targetX, this.targetY);
        if (this.lastNode != null) {
          this.floorplan.newWall(this.lastNode, corner);
        }
        if (corner.mergeWithIntersected() && this.lastNode != null) {
          this.setMode(floorplannerModes.MOVE);
        }
        this.lastNode = corner;
      }
    }

    mouseleave() {
      this.mouseDown = false;
      //scope.setMode(scope.modes.MOVE);
    }

    reset() {
      this.resizeView();
      this.setMode(floorplannerModes.MOVE);
      this.resetOrigin();
      this.view.draw();
    }

    resizeView() {
      this.view.handleWindowResize();
    }

    setMode(mode) {
      this.lastNode = null;
      this.mode = mode;
      this.modeResetCallbacks.fire(mode);
      this.updateTarget();
    }

    resetOrigin() {
      const centerX = this.canvasElement.width / 2.0;
      const centerY = this.canvasElement.height / 2.0;
      const centerFloorplan = this.floorplan.getCenter();
      this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
      this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
    }

    convertX(x) {
      return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
    }

    convertY(y) {
      return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
    }
}
