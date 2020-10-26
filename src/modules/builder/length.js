export class Length {

    start;  // Vector3
    end; // Vector3
    adt;
    scene;

    constructor(scene, adt) {
        this.scene = scene;
        this.adt = adt;
    
    }

    set start(vector3) {
        this.start = vector3;
    }

    get start() {
        return this.start;
    }

    set end(vector3) {
        this.end = vector3;
    }

    get end() {
        return this.end;
    }

}