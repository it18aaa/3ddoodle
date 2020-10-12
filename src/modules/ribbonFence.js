import "@babylonjs/core/Meshes/meshBuilder";
// import { StringLine } from './stringLine';
import { Vector3 } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/";
// import { Mesh } from "@babylonjs/core/Meshes";
// import { RibbonBuilder } from "babylonjs";

export class RibbonFence {
    scene;
    stringLine;
    height = 1.8;  // 1.8 m is standard fence height
    width = 0.02;  // width of the fence / wall
    ribbon;

    constructor(stringLine, scene, height) {
        this.scene = scene ? scene : null;
        this.stringLine = stringLine;

        this.height = height ? height : this.height;
        // this.width  = width  ? width: this.width;
    }

    get height() {
        return this.height;
    }
    set height(val) {
        this.height = val;
    }

    getMesh() {
        if (this.stringLine.getLines().length > 1) {
            var path1 = [];
            var path2 = [];

            // need 2 paths for the ribbon

            this.stringLine.getLines().forEach(line => {
                path1.push(new Vector3(line.x, 0.001, line.z));
                path2.push(new Vector3(line.x, this.height, line.z));
            });

            console.log("arrays: ", [path1, path2])
            this.ribbon = MeshBuilder.CreateRibbon("ribbon",
                {
                    pathArray: [path1, path2]
                });
            this.ribbon.convertToFlatShadedMesh()   
            
        }        
       
        return this.ribbon;
    }  

}
