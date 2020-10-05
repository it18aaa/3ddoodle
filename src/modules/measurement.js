import { DisplayPassPostProcess, MeshBuilder, Vector3 } from "babylonjs";

export class Measurement {

    start;    //vector2
    end;      // vector2
    offset;   // measure from...
    height;  //  height off ground
    scene;   // ref to the Scene tree
    adt;    // ref to AdvancedDynamicTexture
    name;   // ref to name
    points = [];
    linesMesh;
    visible;  // are we rendering?
    orientation;  // hack!  x (width) or y (length)

    //  orientation shouldn't matter but is hacked in for time being!

    prototype(scene, adt, orientation) {
        this.scene = scene;
        this.adt = adt;
        this.visible = false;
        this.orientation = orientation;
    }

    set offset(offset) {
        this.offset = offset;
    }

    get offset() {
        return this.offset;
    }
    set height(height) {
        this.height = height;
    }

    get height() {
        return this.height;
    }

    set visible(visible) {
        this.visable = visable
    }
    get visible() { return visible; }

    update(start, end) {
        this.start.x = start.y;
        this.start.y = start.y
        this.end.x = end.x;
        this.end.y = end.y;
    }

    draw() {
        p = this.points;   // grab a ref to points for brevity
        h = this.height;   // ref to height
        s = this.start;
        e = this.end;
        o = this.offset;

        if (this.orientation === "y") {
            p.push(new Vector3(s.x, h, s.y));
            p.push(new Vector3(s.x - o, h, s.y));
            p.push(new Vector3(s.x - o, h, e.y));
            p.push(new Vector3(e.x - o, h, e.y));            
        } else {
            p.push(new Vector3)
        }




    }

    update() {


    }

    dispose() {

    }


}