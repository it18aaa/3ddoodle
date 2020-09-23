import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math";

export class Outline {
    scene;
    fencePosts = [];
    path = [];
    fencePostCounter = 0;
    dragBehaviour;

    constructor(scene) {
        // reference the scene
        this.scene = scene;

        // init drag behaviour
        this.dragBehaviour = new PointerDragBehavior({dragPlaneNormal: new Vector3(0, -1, 0)})
    }

    addFencePost(position) {
        this.fencePostCounter++;
        var newFencePost = MeshBuilder.CreateBox("fencePost" + this.fencePostCounter.toString(), { width: 5, height: 2, depth: 5 }, scene)
        this.fencePosts.push(newFencePost);
    }



}
