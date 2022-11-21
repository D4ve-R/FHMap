import { Utils, Dimensions } from "../core";
import { floorplannerModes } from "../controller";

  // grid parameters
  const gridSpacing = 20; // pixels
  const gridWidth = 1;
  const gridColor = "#afafef";

  // room config
  const roomColor = "#f9f9f9";

  // wall config
  const wallWidth = 5;
  const wallWidthHover = 7;
  const wallColor = "#dddddd"
  const wallColorHover = "#008cba"
  const edgeColor = "#888888"
  const edgeColorHover = "#008cba"
  const edgeWidth = 1

  const deleteColor = "#ff0000";

  // corner config
  const cornerRadius = 0
  const cornerRadiusHover = 7
  const cornerColor = "#cccccc"
  const cornerColorHover = "#008cba"

  /**
   * The View to be used by a Floorplanner to render in/interact with.
   */
export class FloorPlanView {
    constructor(floorplan, viewcontroller, canvas) {
      this.canvasElement = document.getElementById(canvas);
      this.context = this.canvasElement.getContext('2d');
	  this.devicePixelRatio = window.devicePixelRatio || 1;
	  this.scale = 1;
	  this.floorplan = floorplan;
	  this.viewcontroller = viewcontroller;
	  this.gridSpacing = gridSpacing;

      this.handleWindowResize();
    }

    handleWindowResize() {
      const parent = this.canvasElement.parentElement;
      this.canvasElement.height = parseInt(parent.style.height);
      this.canvasElement.width = parseInt(parent.style.width);
      this.draw();
    }

    draw() {
      this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

      this.drawGrid();

      this.floorplan.getRooms().forEach((room) => {
        this.drawRoom(room);
      })

      this.floorplan.getWalls().forEach((wall) => {
        this.drawWall(wall);
      });

      this.floorplan.getCorners().forEach((corner) => {
        this.drawCorner(corner);
      });

      if (this.viewcontroller.mode == floorplannerModes.DRAW) {
        this.drawTarget(this.viewcontroller.targetX, this.viewcontroller.targetY, this.viewcontroller.lastNode);
      }

      this.floorplan.getWalls().forEach((wall) => {
        this.drawWallLabels(wall);
      });
    }

    drawWallLabels(wall) {
      // we'll just draw the shorter label... idk
      if (wall.backEdge && wall.frontEdge) {
        if (wall.backEdge.interiorDistance < wall.frontEdge.interiorDistance) {
          this.drawEdgeLabel(wall.backEdge);
        } else {
          this.drawEdgeLabel(wall.frontEdge);
        }
      } else if (wall.backEdge) {
        this.drawEdgeLabel(wall.backEdge);
      } else if (wall.frontEdge) {
        this.drawEdgeLabel(wall.frontEdge);
      }
    }

    drawWall(wall) {
      const hover = (wall === this.viewcontroller.activeWall);
      let color = wallColor;
      if (hover && this.viewcontroller.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = wallColorHover;
      }
      this.drawLine(
        this.viewcontroller.convertX(wall.getStartX()),
        this.viewcontroller.convertY(wall.getStartY()),
        this.viewcontroller.convertX(wall.getEndX()),
        this.viewcontroller.convertY(wall.getEndY()),
        hover ? wallWidthHover : wallWidth,
        color
      );
      if (!hover && wall.frontEdge) {
        this.drawEdge(wall.frontEdge, hover);
      }
      if (!hover && wall.backEdge) {
        this.drawEdge(wall.backEdge, hover);
      }
    }

    drawEdgeLabel(edge) {
      const pos = edge.interiorCenter();
      const length = edge.interiorDistance();
	  this.drawLength(pos.x, pos.y, length);
    }

	drawEdge(edge, hover) {
      let color = edgeColor;
      if (hover && this.viewcontroller.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = edgeColorHover;
      }
      const corners = edge.corners();

      const scope = this;
      this.drawPolygon(
        Utils.map(corners, function (corner) {
          return scope.viewcontroller.convertX(corner.x);
        }),
        Utils.map(corners, function (corner) {
          return scope.viewcontroller.convertY(corner.y);
        }),
        false,
        null,
        true,
        color,
        edgeWidth
      );
    }

    drawRoom(room) {
      const scope = this;
      this.drawPolygon(
        Utils.map(room.corners, (corner) => {
          return scope.viewcontroller.convertX(corner.x);
        }),
        Utils.map(room.corners, (corner) =>  {
          return scope.viewcontroller.convertY(corner.y);
        }),
        true,
        roomColor
      );
    }

    drawCorner(corner) {
      const hover = (corner === this.viewcontroller.activeCorner);
      let color = cornerColor;
      if (hover && this.viewcontroller.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = cornerColorHover;
      }
      this.drawCircle(
        this.viewcontroller.convertX(corner.x),
        this.viewcontroller.convertY(corner.y),
        hover ? cornerRadiusHover : cornerRadius,
        color
      );
    }

    drawTarget(x, y, lastNode) {
      this.drawCircle(
        this.viewcontroller.convertX(x),
        this.viewcontroller.convertY(y),
        cornerRadiusHover,
        cornerColorHover
      );
      if (this.viewcontroller.lastNode) {
        this.drawLine(
          this.viewcontroller.convertX(lastNode.x),
          this.viewcontroller.convertY(lastNode.y),
          this.viewcontroller.convertX(x),
          this.viewcontroller.convertY(y),
          wallWidthHover,
          wallColorHover
        );
		const length = Utils.distance(lastNode.x, lastNode.y, x, y) /// this.viewcontroller.pixelsPerCm;
		this.drawLength((x + lastNode.x) / 2.0, (y + lastNode.y) / 2.0, length);
	  }
    }

    drawLine(startX, startY, endX, endY, width, color) {
      // width is an integer
      // color is a hex string, i.e. #ff0000
      this.context.beginPath();
      this.context.moveTo(startX, startY);
      this.context.lineTo(endX, endY);
      this.context.lineWidth = width;
      this.context.strokeStyle = color;
      this.context.stroke();
    }

    drawPolygon(xArr, yArr, fill, fillColor, stroke, strokeColor, strokeWidth) {
      // fillColor is a hex string, i.e. #ff0000
      fill = fill || false;
      stroke = stroke || false;
      this.context.beginPath();
      this.context.moveTo(xArr[0], yArr[0]);
      for (let i = 1; i < xArr.length; i++) {
        this.context.lineTo(xArr[i], yArr[i]);
      }
      this.context.closePath();
      if (fill) {
        this.context.fillStyle = fillColor;
        this.context.fill();
      }
      if (stroke) {
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
      }
    }

    drawCircle(centerX, centerY, radius, fillColor) {
      this.context.beginPath();
      this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.context.fillStyle = fillColor;
      this.context.fill();
    }

   	calculateGridOffset(n) {
      if (n >= 0) {
        return (n + gridSpacing / 2.0) % gridSpacing - gridSpacing / 2.0;
      } else {
        return (n - gridSpacing / 2.0) % gridSpacing + gridSpacing / 2.0;
      }
    }

    drawGrid() {
      const offsetX = this.calculateGridOffset(-this.viewcontroller.originX);
      const offsetY = this.calculateGridOffset(-this.viewcontroller.originY);
      const width = this.canvasElement.width;
      const height = this.canvasElement.height;
      for (let x = 0; x <= (width / this.gridSpacing); x++) {
        this.drawLine(this.gridSpacing * x + offsetX, 0, this.gridSpacing * x + offsetX, height, gridWidth, gridColor);
      }
      for (let y = 0; y <= (height / this.gridSpacing); y++) {
        this.drawLine(0, this.gridSpacing * y + offsetY, width, this.gridSpacing * y + offsetY, gridWidth, gridColor);
      }
    }

	drawLength(x,y,length) {
		if(length < 75)
			return;

		this.context.font = "normal 12px Arial";
		this.context.fillStyle = "#000000";
		this.context.textBaseline = "middle";
		this.context.textAlign = "center";
		this.context.strokeStyle = "#ffffff";
		this.context.lineWidth = 4;
		this.context.strokeText(Dimensions.cmToMeasure(length),
        this.viewcontroller.convertX(x),
        this.viewcontroller.convertY(y));
        this.context.fillText(Dimensions.cmToMeasure(length),
        this.viewcontroller.convertX(x),
        this.viewcontroller.convertY(y));
	}
}
