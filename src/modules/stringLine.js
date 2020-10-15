import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Meshes/meshBuilder";
import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
// import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
// import * as EarcutRef from "earcut";
// import { Line } from "@babylonjs/gui";
import { Measurement } from "./measurement"
// import { Mesh } from "@babylonjs/core/Meshes";
// import { mitredExtrude } from "./mitredExtrude";

export class StringLine {
    scene;
    posts = [];
    lengths = [];
    labels = [];
    extents = {};
    dragBehavior;
    linesMesh;
    totalLength;

    type;
    showLabels = true;
    // measureX;
    // measureY;
    isClosed = true;


    adt;
    dimensions = {
        height: .3,
        diameterTop: 0.05,
        diameterBottom: 0.02
    };

    constructor(scene, adt, isClosed) {
        this.scene = scene;
        this.postMaterial = new StandardMaterial("postMaterial", scene);
        this.postMaterial.diffuseColor = new Color3(1, .5, 0);
        this.adt = adt;
        this.isClosed = isClosed;

        let mx = new Measurement(this.scene, this.adt, "x");
        let my = new Measurement(this.scene, this.adt, "y");


        mx.offset = .5;
        mx.height = 0.25;
        my.offset = .5;
        my.height = 0.25;

        this.measureX = mx;
        this.measureY = my;

        // the updater function updates the mesh
        // we register it as a callback so it is performd before it renders
        // and store a copy in the object, to unregister it later!
        var that = this;
        const updater = function () {
            that.updateMesh();
        }
        this.scene.registerBeforeRender(updater);

        this.updater = updater;

    }

    get type() {
        return this.type;
    }

    set type(type) {
        this.type = type;
    }
    get isClosed() {
        return this.isClosed;
    }

    set isClosed(value) {
        if (value == true || value == false) {
            this.isClosed = value;
        }
    }
    createFencePost() {
        name = "post" + (this.posts.length + 1);

        const fencePost = MeshBuilder.CreateCylinder(
            name,
            this.dimensions,
            this.scene
        );

        fencePost.material = this.postMaterial;
        fencePost.isPickable = true;

        const dragBehavior = new PointerDragBehavior({
            dragPlaneNormal: new Vector3(0, -1, 0),
        });

        fencePost.addBehavior(dragBehavior);

        dragBehavior.onDragObservable.add((event) => {
            this.updateExtents();
        });


        return fencePost;
    }

    // creates an array of Vector3 that containes the positions for 
    // the lines
    getLines(posts) {
        const lines = [];
        this.posts.forEach((post) => {

            var pos = post.position.clone(); // vector3
            pos.y = 0.01;
            lines.push(pos);
        });

        // close the loop!
        if (this.posts[0] && this.isClosed) {
            var pos = this.posts[0].position.clone(); // vector3
            pos.y = 0.01;
            lines.push(pos);
        }
        return lines;
    }

    getLengths() {
        return this.lengths;
    }

    get totalLength() {
        return this.totalLength;
    }
    updateTotalLength() {

        if (this.lengths.length > 0) {
            var sum = 0;
            this.lengths.forEach(length => {
                sum += length;
            });
            this.totalLength = sum;
        }
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

            // if the stringline is circular, and the last points
            // connects to the first, add that
            if (this.isClosed) {
                this.lengths.push(
                    this.posts[last].position.subtract(this.posts[0].position).length()
                );
            }
        }
        this.updateTotalLength();
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
            this.addLabel(newFencePost);
            this.updateExtents();
        }
    }

    undoAddFencePost() {
        // not yet implemented or tested, probably not required!
        let post = this.posts.pop();
        post.dispose();
        this.updateLengths();
        this.resizeMesh();
        this.updateExtents();
    }

    delFencePostByName(name) {
        //  delete from array and update lengths, resize mesh and delete label
        // assume name is postXXX get the index, then knock it out the array
        let index = parseInt(name.substring(4)) - 1;

        this.posts[index].dispose();
        this.labels[index].dispose();
        this.posts.splice(index, 1);
        this.labels.splice(index, 1);

        this.updateLengths();
        this.updatePostNames();
        this.resizeMesh();
        this.updateExtents();

    }

    updatePostNames() {
        // iterate all posts and alter names and labels accordingly
        for (let i = 0; i < this.posts.length; i++) {
            this.posts[i].name = "post" + (i + 1);
            // if(this.labels[i].name != "label" + (i + 1) ) {
            this.labels[i].name = "label" + (i + 1);
            this.labels[i].text = `${i + 1}`;
            // }            
        }
    }

    getExtents() {
        return this.extents;
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

    addLabel(mesh) {
        // remove 'post' from the name
        let i = parseInt(mesh.name.substring(4)) - 1;
        let label = new TextBlock(
            `label${i}`,
            `${i + 1}`
        );

        this.labels.push(label);
        label.outlineColor = "black";
        label.outlineWidth = 4;
        label.fontSize = 22;
        label.color = "yellow";
        label.alpha = 0.7;
        label.linkOffsetX = 0;
        label.linkOffsetY = -30;

        this.adt.addControl(label);
        label.linkWithMesh(mesh);

    }

    updateMesh() {

        this.linesMesh = MeshBuilder.CreateLines(null, {
            points: this.getLines(),
            instance: this.linesMesh,
        });
        this.updateLengths();
    }

    updateExtents() {

        let minX = this.posts[0].position.x;
        let maxX = this.posts[0].position.x;
        let minZ = this.posts[0].position.z;
        let maxZ = this.posts[0].position.z;

        this.posts.forEach(post => {
            minX = minX > post.position.x ? post.position.x : minX;
            maxX = maxX < post.position.x ? post.position.x : maxX;
            minZ = minZ > post.position.z ? post.position.z : minZ;
            maxZ = maxZ < post.position.z ? post.position.z : maxZ;
        });

        this.extents = {
            min: new Vector3(minX, 0.5, minZ),
            max: new Vector3(maxX, 0.5, maxZ),
            length: maxX - minX,
            width: maxZ - minZ
        }

    }

    reset() {
        // cleanup
        this.posts.forEach((post) => {
            post.dispose();
        });
        this.posts = [];

        if (this.linesMesh) {
            this.linesMesh.dispose();
        }

        if (this.labels.length > 0) {
            this.labels.forEach((label) => {
                this.adt.removeControl(label);
                label.dispose();
            });
            this.labels = [];
        }

        // this.adt.clear();
    }

    dispose() {
        this.reset();
        this.adt = null;
        var that = this;
        this.scene.unregisterBeforeRender(this.updater)
        this.scene = null;
    }

}
