import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Meshes/meshBuilder"

import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Vector2 } from "@babylonjs/core/Maths/math";

import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/"
import { Color3 } from "babylonjs";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh"
import * as EarcutRef from "earcut"

export class Outline {
    scene;
    posts = [];
    lengths = [];
    postCounter = 0;
    dragBehavior;
    linesMesh;
    polygon;

    dimensions = {
        height: 1, depth: 1, width: 1, diameter: 0.2
    }

    constructor(scene) {
        this.scene = scene;
        this.postMaterial = new StandardMaterial("postMaterial", scene);
        this.postMaterial.diffuseColor = new Color3(0, 1, 0);
    }

    createFencePost() {
        this.postCounter++;
        name = "post" + this.postCounter.toString();
        
        const fencePost = MeshBuilder.CreateCylinder(name,
            {
                height: this.dimensions.height,
                diameter: this.dimensions.diameter,
            },
            this.scene);

        fencePost.material = this.postMaterial;

        fencePost.isPickable = true;
        fencePost.addBehavior(new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, -1, 0) }));


        return fencePost;
    }

    getLines(posts) {
        const lines = [];
        this.posts.forEach(post => {
            lines.push(post.position);
        })
        return lines;
    }

    getLengths() {
        for(let i = 0; i < this.posts.length - 1;  i++ ) {
            console.log(this.posts[i].position.subtract(this.posts[i+1].position).length());
        }
    }

    addFencePost(position) {
        var newFencePost = this.createFencePost();
        newFencePost.position = position;
        newFencePost.position.y = this.dimensions.height / 2;

        this.posts.push(newFencePost);
        this.resizeMesh()
    }

    resizeMesh() {
        console.log(this.linesMesh)
        if (this.linesMesh) {
            this.linesMesh.dispose();
        }

        this.linesMesh = MeshBuilder.CreateLines("lines",
            {
                points: this.getLines(),
                updatable: true
            },
            this.scene);
    }

    updateMesh() {
        this.linesMesh = MeshBuilder.CreateLines(null,
            {
                points: this.getLines(),
                instance: this.linesMesh
            });
    }


    reset() {
        console.log("Clearing stuff!");
        this.posts.forEach(post => {
            post.dispose();
        });

        this.posts = [];

        if (this.linesMesh) {
            this.linesMesh.dispose();
        }

        if(this.polygon) {
            this.polygon.dispose();            
        }

    }

    getPolygonFromLines() {
        console.log("getPolygonFromLines")
        
        if (this.getLines().length > 2) {
            var corners = [];
            this.getLines().forEach((line) => {
                corners.push(new Vector2(line.x, line.z));
            });

            console.log(corners);
            var polygon_triangulation = new PolygonMeshBuilder("biff", corners, this.scene, EarcutRef);

            if(this.polygon) {
                this.polygon.dispose();
            }
            this.polygon = polygon_triangulation.build(false, .1);
            // this.reset();

            console.log(this.polygon)
            this.polygon.position.y = .1

        }
    }

}
