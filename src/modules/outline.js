import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Meshes/meshBuilder";

import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Vector2 } from "@babylonjs/core/Maths/math";

import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/";
import { Color3 } from "babylonjs";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh";

import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";

import * as EarcutRef from "earcut";

export class Outline {
    scene;
    posts = [];
    lengths = [];
    labels = [];
    // postCounter = 0;
    dragBehavior;
    linesMesh;
    polygon;
    showLabels = true;

    adt;
    dimensions = {
        height: 1,
        depth: 1,
        width: 1,
        diameter: 0.2,
    };

    constructor(scene, adt) {
        this.scene = scene;
        this.postMaterial = new StandardMaterial("postMaterial", scene);
        this.postMaterial.diffuseColor = new Color3(1, .5, 0);
        this.adt = adt;        
    }

    createFencePost() {
        // this.postCounter++;  // do we need this?
        
        //name = "post" + this.postCounter.toString();
        name = "post" + (this.posts.length + 1);

        const fencePost = MeshBuilder.CreateCylinder(
            name,
            {
                height: this.dimensions.height,
                diameter: this.dimensions.diameter,
            },
            this.scene
        );

        fencePost.material = this.postMaterial;
        fencePost.isPickable = true;

        const dragBehavior = new PointerDragBehavior({
            dragPlaneNormal: new Vector3(0, -1, 0),
        });

        dragBehavior.onDragEndObservable.add((event) => {
            this.createLabels();
        });

        fencePost.addBehavior(dragBehavior);

        return fencePost;
    }

    // creates an array of Vector3 that containes the positions for 
    // the lines
    getLines(posts) {
        const lines = [];
        this.posts.forEach((post) => {
            lines.push(post.position);
        });
        if (this.posts[0]) {
            lines.push(this.posts[0].position);
        }
        return lines;
    }

    getLengths() {
        return this.lengths;
    }

    // updates the lengths array
    // only needs calling when a post is moved or a new post is added
    updateLengths() {
        if (this.posts.length > 1) {
            this.lengths = [];
            const last = this.posts.length - 1;
            for (let i = 0; i < this.posts.length - 1; i++) {
                this.lengths.push(
                    this.posts[i].position.subtract(this.posts[i + 1].position).length()
                );
            }
            this.lengths.push(
                this.posts[last].position.subtract(this.posts[0].position).length()
            );
        }
    }

    // adds a fence post at position ....    
    addFencePost(position) {
        if (position) {
            var newFencePost = this.createFencePost();
            newFencePost.position = position;
            newFencePost.position.y = this.dimensions.height / 2;

            this.posts.push(newFencePost);
            this.updateLengths();
            this.resizeMesh();
            this.createLabels();
        }
    }

    undoAddFencePost() {
        let post = this.posts.pop();
        post.dispose();
        this.updateLengths();
        this.resizeMesh();
        this.createLabels();        
    }

    delFencePostByName(name) {
        //  delete from array and update lengths, resize mesh and delete label
        // assume name is postXXX get the index, then knock it out the array
        let index = parseInt(name.substring(4))-1;
        console.log("Name: ", name);
        console.log("post index: ", index);
        this.posts[index].dispose();
        this.posts.splice(index, 1);
        this.updateLengths();
        this.updatePostNames();
        this.resizeMesh();
        this.createLabels();
    }

    updatePostNames() {
        
        for(let i = 0; i < this.posts.length; i++) {
            this.posts[i].name  = "post" + (i + 1);
        }                    
    }

    resizeMesh() {        
        // if the number of posts has has changed
        // delete the old mesh and create anew         
        if (this.linesMesh) {
            this.linesMesh.dispose();
        }

        this.linesMesh = MeshBuilder.CreateLines(
            "lines",
            {
                points: this.getLines(),
                updatable: true,
            },
            this.scene
        );
    }

    createLabels() {
        // recreate labels - TODO: just push new label, and reattach all
        this.labels.forEach((label) => {
            this.adt.removeControl(label);
            label.dispose();

        });
        this.labels = [];

        let i = 0;
        this.lengths.forEach((length) => {
            let label = new TextBlock(
                `label${i}`,
                `${i+1}`                
            );
            
            this.adt.addControl(label);
            label.linkWithMesh(this.posts[i]);
            label.outlineColor ="black" ;
            label.outlineWidth = 4;
            label.fontSize = 22;
            label.color = "yellow";
            label.alpha = 0.7;

            label.linkOffsetX = 0;
            label.linkOffsetY = -30;            
            this.labels[i] = label;
            i++;
        });
    }

    updateMesh() {
        // updates every frame - instance of lines, so they snap to
        // the stringline posts
        this.linesMesh = MeshBuilder.CreateLines(null, {
            points: this.getLines(),
            instance: this.linesMesh,
        });
        this.updateLengths();
    }

    updateLabels() {
        for (let i = 0; i < this.lengths.length; i++) {
            //this.labels[i].text(this.lengths[i].toString() + "m");
            console.log("update labels  labels:", this.labels[i]);
        }
    }

    reset() {
        console.log("Clearing stuff!");
        this.posts.forEach((post) => {
            post.dispose();
        });

        this.posts = [];

        if (this.linesMesh) {
            this.linesMesh.dispose();
        }

        if (this.polygon) {
             this.polygon.dispose();
        }

        

        if (this.labels.length > 0) {
            this.labels.forEach((label) => {
                console.log("Clearing: ", label);
                this.adt.removeControl(label);
                label.dispose();
            });
            this.labels = [];
        }
        console.log(this.adt)
        this.adt.clear();


    }

    getPolygonFromLines() {
        

        if (this.getLines().length > 2) {
            var corners = [];
            this.getLines().forEach((line) => {
                corners.push(new Vector2(line.x, line.z));
            });

            //console.log(corners);
            var polygon_triangulation = new PolygonMeshBuilder(
                "biff",
                corners,
                this.scene,
                EarcutRef
            );

            if (this.polygon) {
                this.polygon.dispose();
            }
            this.polygon = polygon_triangulation.build(false);
            // this.reset();

            //console.log(this.polygon);
            this.polygon.position.y = 0.1;           

        }
    }

    getPolygon() {
        if(this.polygon) {
            return this.polygon.clone();
        } else {
            return null;
        }
    }

}
