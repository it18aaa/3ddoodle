
import "@babylonjs/core/Meshes/meshBuilder"
import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/"

export class Outline {
    scene;
    fencePosts = [];
    path = [];
    fencePostCounter = 0;
    dragBehavior;

    dimensions = {
        height: 1, depth: 1, width: 1
    }

    constructor(scene) {
        // reference the scene
        this.scene = scene;

        // init drag behaviour
        
    }

    createFencePost() {
        const fencePost = MeshBuilder.CreateBox(name, this.dimensions, this.scene);
        fencePost.isPickable = true;
        fencePost.addBehavior(new PointerDragBehavior({dragPlaneNormal: new Vector3(0, -1, 0)}));
        return fencePost;
    }

    

    addFencePost(position) {
        this.fencePostCounter++;
        name = "fencePost" + this.fencePostCounter.toString();
        console.log(name)
        var newFencePost = this.createFencePost();
        
        
        newFencePost.position = position;
        newFencePost.position.y = this.dimensions.height / 2;
        

        this.fencePosts.push(newFencePost);
    }


}
