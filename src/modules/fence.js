import "@babylonjs/core/Meshes/meshBuilder";
import { StringLine } from './stringLine';
import { Vector3 } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/";
import { Mesh } from "@babylonjs/core/Meshes";

export class Fence extends StringLine {
   height = 1.8;  // 1.8 m is standard fence height
   width = 0.02;  // width of the fence / wall

    constructor(scene, adt) {
        // its not closed
        super(scene, adt, false);        
    }

    
    getFence() {        

        if (this.getLines().length > 1) {
            var corners = [];
            this.getLines().forEach(line => {
                corners.push(new Vector3(line.x, 0.001, line.z));
            });            

            var wallshape = [
                new Vector3(this.width/2, 0, 0),
                new Vector3(this.width/2, this.height, 0),
                new Vector3(-this.width/2, this.height, 0),
                new Vector3(-this.width/2, 0, 0),
                new Vector3(this.width/2, 0, 0)
            ];

            this.extrusion = MeshBuilder.ExtrudeShape(
                "thing",
                {
                    shape: wallshape,
                    path: corners,
                    // sideOrientation: Mesh.DOUBLESIDE,
                    sideOrientation: Mesh.DEFAULTSIDE,
                    cap: Mesh.CAP_ALL,
                    updatable: true
                },
                this.scene);
            this.extrusion.convertToFlatShadedMesh();            

        }
    }
}