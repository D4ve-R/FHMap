import { Utils, Dimensions } from "../core";

export const floorplannerModes = {
    MOVE: 0,
    DRAW: 1,
    DELETE: 2
  };

  // grid parameters
  const gridSpacing = 20; // pixels
  const gridWidth = 1;
  const gridColor = "#f1f1f1";

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
    constructor(floorplan, viewmodel, canvas) {
      this.canvasElement = document.getElementById(canvas);
      this.context = this.canvasElement.getContext('2d');
	  this.floorplan = floorplan;
	  this.viewmodel = viewmodel;

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

      if (this.viewmodel.mode == floorplannerModes.DRAW) {
        this.drawTarget(this.viewmodel.targetX, this.viewmodel.targetY, this.viewmodel.lastNode);
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
      const hover = (wall === this.viewmodel.activeWall);
      let color = wallColor;
      if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = wallColorHover;
      }
      this.drawLine(
        this.viewmodel.convertX(wall.getStartX()),
        this.viewmodel.convertY(wall.getStartY()),
        this.viewmodel.convertX(wall.getEndX()),
        this.viewmodel.convertY(wall.getEndY()),
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
      if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = edgeColorHover;
      }
      const corners = edge.corners();

      const scope = this;
      this.drawPolygon(
        Utils.map(corners, function (corner) {
          return scope.viewmodel.convertX(corner.x);
        }),
        Utils.map(corners, function (corner) {
          return scope.viewmodel.convertY(corner.y);
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
          return scope.viewmodel.convertX(corner.x);
        }),
        Utils.map(room.corners, (corner) =>  {
          return scope.viewmodel.convertY(corner.y);
        }),
        true,
        roomColor
      );
    }

    drawCorner(corner) {
      const hover = (corner === this.viewmodel.activeCorner);
      let color = cornerColor;
      if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
        color = deleteColor;
      } else if (hover) {
        color = cornerColorHover;
      }
      this.drawCircle(
        this.viewmodel.convertX(corner.x),
        this.viewmodel.convertY(corner.y),
        hover ? cornerRadiusHover : cornerRadius,
        color
      );
    }

    drawTarget(x, y, lastNode) {
      this.drawCircle(
        this.viewmodel.convertX(x),
        this.viewmodel.convertY(y),
        cornerRadiusHover,
        cornerColorHover
      );
      if (this.viewmodel.lastNode) {
        this.drawLine(
          this.viewmodel.convertX(lastNode.x),
          this.viewmodel.convertY(lastNode.y),
          this.viewmodel.convertX(x),
          this.viewmodel.convertY(y),
          wallWidthHover,
          wallColorHover
        );
		const length = Utils.distance(lastNode.x, lastNode.y, x, y) /// this.viewmodel.pixelsPerCm;
		this.drawLength(x, y, length);
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
      const offsetX = this.calculateGridOffset(-this.viewmodel.originX);
      const offsetY = this.calculateGridOffset(-this.viewmodel.originY);
      const width = this.canvasElement.width;
      const height = this.canvasElement.height;
      for (let x = 0; x <= (width / gridSpacing); x++) {
        this.drawLine(gridSpacing * x + offsetX, 0, gridSpacing * x + offsetX, height, gridWidth, gridColor);
      }
      for (let y = 0; y <= (height / gridSpacing); y++) {
        this.drawLine(0, gridSpacing * y + offsetY, width, gridSpacing * y + offsetY, gridWidth, gridColor);
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
        this.viewmodel.convertX(x),
        this.viewmodel.convertY(y));
        this.context.fillText(Dimensions.cmToMeasure(length),
        this.viewmodel.convertX(x),
        this.viewmodel.convertY(y));
	}
}
