import { Utils, Callbacks } from "../core";
import { Matrix4, Vector3, BufferGeometry, Mesh, MeshBasicMaterial } from 'three';

/**
   * Half Edges are created by Room.
   * 
   * Once rooms have been identified, Half Edges are created for each interior wall.
   * 
   * A wall can have two half edges if it is visible from both sides.
   */
 export class HalfEdge {

    /** The successor edge in CCW ??? direction. */
    next;

    /** The predecessor edge in CCW ??? direction. */
    prev;

    /** */
    offset;

    /** */
    height;

    /** used for intersection testing... not convinced this belongs here */
    plane = null;

    /** transform from world coords to wall planes (z=0) */
    interiorTransform = new Matrix4();

    /** transform from world coords to wall planes (z=0) */
    invInteriorTransform = new Matrix4();

    /** transform from world coords to wall planes (z=0) */
    exteriorTransform = new Matrix4();

    /** transform from world coords to wall planes (z=0) */
    invExteriorTransform = new Matrix4();

    /** */
    redrawCallbacks = new Callbacks();

    /**
     * Constructs a half edge.
     * @param room The associated room.
     * @param wall The corresponding wall.
     * @param front True if front side.
     */
    constructor(room, wall, front, level) {
      this.front = front || false;
	  this.room = room;
	  this.front = front;
	  this.wall = wall;
	  

      this.offset = wall.thickness / 2.0;
      this.height = wall.height;

      if (this.front) {
        this.wall.frontEdge = this;
      } else {
        this.wall.backEdge = this;
      }
    }

    /**
     * 
     */
    getTexture() {
      if (this.front) {
        return this.wall.frontTexture;
      } else {
        return this.wall.backTexture;
      }
    }

    /**
     * 
     */
    setTexture(textureUrl, textureStretch, textureScale) {
      const texture = {
        url: textureUrl,
        stretch: textureStretch,
        scale: textureScale
      }
      if (this.front) {
        this.wall.frontTexture = texture;
      } else {
        this.wall.backTexture = texture;
      }
      this.redrawCallbacks.fire();
    }

    /** 
     * this feels hacky, but need wall items
     */
    generatePlane = function () {

      function transformCorner(corner) {
        return new Vector3(corner.x, 0, corner.y);
      }

      const v1 = transformCorner(this.interiorStart());
      const v2 = transformCorner(this.interiorEnd());
      const v3 = v2.clone();
      v3.y = (1 + this.level) * this.wall.height;
      const v4 = v1.clone();
      v4.y = (1 + this.level) * this.wall.height;

	  const points = [
		v1, v2, v3,
		v1, v3, v4
	  ]

      const geometry = new BufferGeometry().setFromPoints(points);
	  geometry.computeVertexNormals();
	  geometry.computeBoundingBox();

      this.plane = new Mesh(geometry,
        new MeshBasicMaterial());
      this.plane.visible = false;
      this.plane.edge = this; // js monkey patch

      this.computeTransforms(
        this.interiorTransform, this.invInteriorTransform,
        this.interiorStart(), this.interiorEnd());
      this.computeTransforms(
        this.exteriorTransform, this.invExteriorTransform,
        this.exteriorStart(), this.exteriorEnd());
    }

    interiorDistance() {
      const start = this.interiorStart();
      const end = this.interiorEnd();
      return Utils.distance(start.x, start.y, end.x, end.y);
    }

    computeTransforms(transform, invTransform, start, end) {

      const v1 = start;
      const v2 = end;
      const angle = Utils.angle(1, 0, v2.x - v1.x, v2.y - v1.y);

      const tt = new Matrix4();
      tt.makeTranslation(-v1.x, 0, -v1.y);
      const tr = new Matrix4();
      tr.makeRotationY(-angle);
      transform.multiplyMatrices(tr, tt);
	  invTransform = transform.clone();
	  invTransform.invert();
    }

    /** Gets the distance from specified point.
     * @param x X coordinate of the point.
     * @param y Y coordinate of the point.
     * @returns The distance.
     */
    distanceTo(x, y) {
      // x, y, x1, y1, x2, y2
      return Utils.pointDistanceFromLine(x, y,
        this.interiorStart().x,
        this.interiorStart().y,
        this.interiorEnd().x,
        this.interiorEnd().y);
    }

    getStart() {
      if (this.front) {
        return this.wall.getStart();
      } else {
        return this.wall.getEnd();
      }
    }

    getEnd() {
      if (this.front) {
        return this.wall.getEnd();
      } else {
        return this.wall.getStart();
      }
    }

    getOppositeEdge() {
      if (this.front) {
        return this.wall.backEdge;
      } else {
        return this.wall.frontEdge;
      }
    }

    // these return an object with attributes x, y
    interiorEnd() {
      const vec = this.halfAngleVector(this, this.next);
      return {
        x: this.getEnd().x + vec.x,
        y: this.getEnd().y + vec.y
      }
    }

    interiorStart() {
      const vec = this.halfAngleVector(this.prev, this);
      return {
        x: this.getStart().x + vec.x,
        y: this.getStart().y + vec.y
      }
    }

    interiorCenter() {
      return {
        x: (this.interiorStart().x + this.interiorEnd().x) / 2.0,
        y: (this.interiorStart().y + this.interiorEnd().y) / 2.0,
      }
    }

    exteriorEnd()  {
      const vec = this.halfAngleVector(this, this.next);
      return {
        x: this.getEnd().x - vec.x,
        y: this.getEnd().y - vec.y
      }
    }

    exteriorStart()  {
      const vec = this.halfAngleVector(this.prev, this);
      return {
        x: this.getStart().x - vec.x,
        y: this.getStart().y - vec.y
      }
    }

    /** Get the corners of the half edge.
     * @returns An array of x,y pairs.
     */
    corners() {
      return [this.interiorStart(), this.interiorEnd(),
        this.exteriorEnd(), this.exteriorStart()];
    }

    /** 
     * Gets CCW angle from v1 to v2
     */
    halfAngleVector(v1, v2) {
		let v1startX = null;
		let v1startY = null;
		let v1endX = null;
		let v1endY = null;
		let v2startX = null;
		let v2startY = null;
		let v2endX = null;
		let v2endY = null;
      // make the best of things if we dont have prev or next
      if (!v1) {
        v1startX = v2.getStart().x - (v2.getEnd().x - v2.getStart().x);
        v1startY = v2.getStart().y - (v2.getEnd().y - v2.getStart().y);
        v1endX = v2.getStart().x;
        v1endY = v2.getStart().y;
      } else {
        v1startX = Number(v1.getStart().x);
        v1startY = Number(v1.getStart().y);
        v1endX = v1.getEnd().x;
        v1endY = v1.getEnd().y;
      }

      if (!v2) {
        v2startX = v1.getEnd().x;
        v2startY = v1.getEnd().y;
        v2endX = v1.getEnd().x + (v1.getEnd().x - v1.getStart().x);
        v2endY = v1.getEnd().y + (v1.getEnd().y - v1.getStart().y);
      } else {
        v2startX = v2.getStart().x;
        v2startY = v2.getStart().y;
        v2endX = v2.getEnd().x;
        v2endY = v2.getEnd().y;
      }

      // CCW angle between edges
      const theta = Utils.angle2pi(
        v1startX - v1endX,
        v1startY - v1endY,
        v2endX - v1endX,
        v2endY - v1endY);

      // cosine and sine of half angle
      const cs = Math.cos(theta / 2.0);
      const sn = Math.sin(theta / 2.0);

      // rotate v2
      const v2dx = v2endX - v2startX;
      const v2dy = v2endY - v2startY;

      const vx = v2dx * cs - v2dy * sn;
      const vy = v2dx * sn + v2dy * cs;

      // normalize
      const mag = Utils.distance(0, 0, vx, vy);
      const desiredMag = (this.offset) / sn;
      const scalar = desiredMag / mag;

      return {
        x: vx * scalar,
        y: vy * scalar
      }
    }
  }