// import "@babylonjs/core/Culling/ray";
// import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// import "@babylonjs/core/Materials/standardMaterial";
// import "@babylonjs/core/Layers/effectLayerSceneComponent";
// import "@babylonjs/loaders";
// import "@babylonjs/core/Loading/loadingScreen";
// import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
// import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";

// required to polyfill async/await stuff in classes
// for browsers
import "core-js";
import "regenerator-runtime/runtime";

import {
    Color3,
    Vector3
} from "@babylonjs/core/Maths/math";
import {
    CubicEase
} from "@babylonjs/core/Animations/easing";
import {
    EasingFunction
} from "@babylonjs/core/Animations/easing"
import {
    Animation
} from "@babylonjs/core/Animations/animation"
// import { Mesh } from "@babylonjs/core/Meshes/mesh"
// import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
// import { Color3 } from "@babylonjs/core/Maths/math.color";
// //import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
// import { VertexBuffer } from "@babylonjs/core/meshes"

//import { PlaneRotationGizmo } from "@babylonjs/core/Gizmos/planeRotationGizmo";
import {
    Vector2
} from "@babylonjs/core/Maths/math";
import {
    PolygonMeshBuilder
} from "@babylonjs/core/Meshes/polygonMesh";
import * as EarcutRef from "earcut";

import {
    Engine
} from "@babylonjs/core/Engines/engine";
import {
    AdvancedDynamicTexture
} from "@babylonjs/gui/2D/advancedDynamicTexture";
import {
    Camera
} from "@babylonjs/core/Cameras/camera";

import {
    createCamera,
    createOutlineScene
} from "./modules/scene";
import {
    StringLine
} from "./modules/stringLine"
import {
    RibbonFence
} from "./modules/ribbonFence"
import {
    EventBus
} from "./modules/eventBus";
import {
    EVENTS
} from "./modules/constants";
import {
    drawGui
} from "./modules/drawGui";


// DEBUG STUFF
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

// TODO:  lots of globals here need to be tidied up.

// init this part of the app
const eventBus = new EventBus();

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true, {
    stencil: true
});
const scene = createOutlineScene(engine);
// create user interface texture
const adt = new AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

const camera = createCamera(canvas, scene);

// this counter is for mesh naming 
// TODO: move out of global name space
var counter = 0;

// dirty hack to prevent overlapping material messs
var groundLevel = 0.001;
function incrementGroundLevel() {
    groundLevel = groundLevel + 0.001;
}



// attach camera to scene to start off with...
camera.attachControl(canvas, false);

//  Frames Per Second counter for profiling
let divFps = document.getElementById("fps");
var showfps = 1;

// init the string-line, this is the principle tool for modifying our
// garden 
const outline = new StringLine(scene, adt, false, eventBus);

drawGui(eventBus);

// run the renderloop
engine.runRenderLoop(function () {
    if (showfps) {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    }
    scene.render();
});

// helper function to determine if the camera has 
// controls attached to it
function getCameraActive() {
    return camera.inputs.attachedElement ? true : false;
}

// LEgacy
eventBus.subscribe(EVENTS.GUI_POLYGON, data => {
   createPolygon(outline, scene, new Color3.Green());
})

// CREATE POLYGON BUTTON
eventBus.subscribe(EVENTS.CREATE_GRASS, data => {
    createPolygon(outline, scene, new Color3(0.2,0.6,0.2));
 })
 
 // CREATE POLYGON BUTTON
eventBus.subscribe(EVENTS.CREATE_PATIO, data => {
    createPolygon(outline, scene, new Color3.Gray());
})

// CREATE POLYGON BUTTON
eventBus.subscribe(EVENTS.CREATE_BORDER, data => {
    createPolygon(outline, scene, new Color3(0.2,0.2,0));
})



function createPolygon(outline, scene, color) {
    if (outline.getLines().length > 2) {
        const corners = [];
        outline.getLines().forEach((line) => {
            corners.push(new Vector2(line.x, line.z));
        });

        const polygon_triangulation = new PolygonMeshBuilder(
            "TODO_CREATE_NAME",
            corners,
            scene,
            EarcutRef
        );

        const polygon = polygon_triangulation.build(false);
        polygon.position.y = groundLevel;
        incrementGroundLevel();

        // polygon.material = scene.getMaterialByName("fence");
        const material = new StandardMaterial("name-material", scene);
        material.diffuseColor = color;
        polygon.material = material;
    }
}


// CLEAR BUTTON
eventBus.subscribe(EVENTS.GUI_CLEAR, (payload) => {
    outline.reset();
})

// VIEW EVENTS
// change between orthographic and perspective view
//
eventBus.subscribe(EVENTS.GUI_CAMERA_ORTHO, (payload) => {
    if (camera.mode == Camera.PERSPECTIVE_CAMERA) {
        // TODO: hardcoded vars
        var distance = 26;
        var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width;
        camera.orthoLeft = -distance / 3;
        camera.orthoRight = distance / 3;
        camera.orthoBottom = camera.orthoLeft * aspect;
        camera.orthoTop = camera.orthoRight * aspect;
        camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    };
})

// change to perspective mode
eventBus.subscribe(EVENTS.GUI_CAMERA_PERSPECTIVE, (payload) => {
    if (camera.mode == Camera.ORTHOGRAPHIC_CAMERA) {
        camera.mode = Camera.PERSPECTIVE_CAMERA;
    };
})


// GET LENGTHS BUTTON 
eventBus.subscribe(EVENTS.GUI_LENGTH_BUTTON, payload => {
    eventBus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
        lengths: outline.getLengths(),
        total: outline.totalLength
    })
})

eventBus.subscribe(EVENTS.GUI_BOUNDING, (payload) => {
    outline.updateExtents();
})


function createFence(outline, data, colour) {
    const f = new RibbonFence(outline);
    f.doubledOver = true;

    if (data.height && data.height > 0.01 && data.height < 10) {
        f.height = data.height;
    }
    const mesh = f.getMesh();

    counter++;
    mesh.name = `fence${counter}`;

    var mat = new StandardMaterial("new mat", scene);
    mat.diffuseColor = colour;
    mesh.material = mat;

    scene.addMesh(mesh);
}

// FENCE - currently making a fence!
eventBus.subscribe(EVENTS.GUI_FENCE, data => {
   createFence(outline, data, new Color3(0.3, 0.2, 0));
    // mesh.material = scene.getMaterialByName("woodFence");
    // mesh.material = scene.getMaterialByName("fence");
})

eventBus.subscribe(EVENTS.GUI_WHITE_FENCE, data => {
    createFence(outline, data, new Color3(1, 1, 1));
 })

 // FENCE - currently making a fence!
eventBus.subscribe(EVENTS.GUI_LIGHT_FENCE, data => {
    createFence(outline, data, new Color3(0.7, 0.5, 0.3));     
 })

 eventBus.subscribe(EVENTS.GUI_BLUE_FENCE, data => {
    createFence(outline, data, new Color3(0.0, 0.4, 0.6));     
 })


 
 



eventBus.subscribe(EVENTS.GUI_TEXTURE_FENCE, payload => {
    const f = new RibbonFence(outline);

    if (payload.height && payload.height > 0.1 && payload.height < 10) {
        f.height = payload.height;
    }
    const mesh = f.getMesh();

    counter++;
    mesh.name = `fence${counter}`;

    scene.addMesh(mesh);
    // mesh.material = scene.getMaterialByName("woodFence");
    mesh.material = scene.getMaterialByName("fence");
})


// CAMERA mode toggle button
eventBus.subscribe(EVENTS.GUI_CAMERA_FREEZE_TOGGLE, (payload) => {

    if (getCameraActive()) {
        // detach mouse controls from camera
        // and set up drawing mode
        camera.detachControl(canvas);
        eventBus.dispatch(EVENTS.CAMERA_FROZEN);
    } else {
        // kill drawing mode and attach
        // mouse input to camera...
        camera.attachControl(canvas, true);
        eventBus.dispatch(EVENTS.CAMERA_UNFROZEN);
    }
});

// switch between camera mode and edit mode

eventBus.subscribe(EVENTS.MODE_EDIT, payload => {
    if (getCameraActive()) {
        camera.detachControl(canvas);
    }
});

eventBus.subscribe(EVENTS.MODE_CAMERA, payload => {
    camera.attachControl(canvas, true);
});


// debug if enabled
eventBus.subscribe(EVENTS.GUI_DEBUG, payload => {
    if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
    } else {
        scene.debugLayer.show();
    };
})


// listen for mouse right click, but if
// only we're in string line mode .... 
canvas.addEventListener("contextmenu", (evt) => {
    if (!getCameraActive()) {
        let picked = scene.pick(scene.pointerX, scene.pointerY);

        if (picked.pickedMesh && picked.pickedMesh.name.substring(0, 4) == "post") {
            outline.delFencePostByName(picked.pickedMesh.name)
        } else {
            outline.addFencePost(picked.pickedPoint);
        }
    }
});


// listen for double click, focus the camera
canvas.addEventListener("dblclick", function (e) {
    if (getCameraActive()) {
        let picked = scene.pick(scene.pointerX, scene.pointerY);
        animateCameraTo(
            picked.pickedPoint.x, // targetx
            picked.pickedPoint.y,
            picked.pickedPoint.z, //
            camera.position.x,
            5, // location y
            camera.position.z,
            5, // spped
            2) // framecount
    }
})

// animation function adapted from 
// https://www.html5gamedevs.com/topic/37992-animating-arcrotatecamera-settarget/
function animateCameraTo(targetX, targetY, targetZ, locationX, locationY, locationZ, speed, frameCount) {
    let ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    let activCam = scene.activeCamera;
    let cameraTarget = new Vector3(targetX + (Math.random() * (0.001 - 0.002) + 0.002), targetY, targetZ);
    let cameraPosition = new Vector3(locationX, locationY, locationZ);
    Animation.CreateAndStartAnimation('at4', activCam, 'position', speed, frameCount, activCam.position, cameraPosition, 0, ease);
    Animation.CreateAndStartAnimation('at5', activCam, 'target', speed, frameCount, activCam.target, cameraTarget, 0, ease);
};

// the canvas/window resize event handler
window.addEventListener("resize", function () {
    engine.resize();
});




// utility method created by CeeJay on html5gameDevs
// this changes the UV scale of a mesh to fit a texture
// so that the same texture can be used on multiple
// meshes... 

// function setUVScale(mesh, uScale, vScale) {
//   var i,
//     UVs = mesh.getVerticesData(VertexBuffer.UVKind),
//     len = UVs.length;

//   if (uScale !== 1) {
//     for (i = 0; i < len; i += 2) {
//       UVs[i] *= uScale;
//     }
//   }
//   if (vScale !== 1) {
//     for (i = 1; i < len; i += 2) {
//       UVs[i] *= vScale;
//     }
//   }

//   mesh.setVerticesData(VertexBuffer.UVKind, UVs);
// }