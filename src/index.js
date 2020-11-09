// required to polyfill async/await stuff in classes
// for browsers
import "core-js";
import "regenerator-runtime/runtime";
import {
    Engine
} from "@babylonjs/core/Engines/engine";
import {
    AdvancedDynamicTexture
} from "@babylonjs/gui/2D/advancedDynamicTexture";

import {
    createCamera,
    createOutlineScene
} from "./modules/builder/scene";
import {
    StringLine
} from "./modules/builder/stringLine";

import {
    EventBus
} from "./modules/event/eventBus";
import {
    EVENTS
} from "./modules/event/types";
import {
    initUI
} from "./modules/UI";

// DEBUG STUFF
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import {
    ShadowGenerator
} from "@babylonjs/core/Lights/Shadows/shadowGenerator";

import {
    initCameraController,
    getCameraActive
} from "./modules/controllers/camera";
import {
    initGroundController
} from "./modules/controllers/ground";
import {
    initFenceController
} from "./modules/controllers/fence";

import {
    SceneLoader
} from "@babylonjs/core/Loading/sceneLoader";

// init this part of the app
const eventBus = new EventBus();
const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true, {
    stencil: true,
});
const scene = createOutlineScene(engine);
const adt = new AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
const camera = createCamera(canvas, scene);
const shadowGenerator = new ShadowGenerator(2048, scene.getLightByName("sun"));
shadowGenerator.usePoissonSampling = true;

//  Frames Per Second counter for profiling
const divFps = document.getElementById("fps");
const showfps = 1;

// init the string-line, this is the principle tool for modifying our
// garden
const outline = new StringLine(scene, adt, false, eventBus);

initGroundController(eventBus, scene, outline);
initFenceController(eventBus, scene, outline, shadowGenerator);
initCameraController(camera, canvas, eventBus, scene);
initUI(eventBus);

// GET LENGTHS BUTTON
eventBus.subscribe(EVENTS.GUI_LENGTH_BUTTON, () => {
    eventBus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
        lengths: outline.getLengths(),
        total: outline.totalLength,
    });
});


// CLEAR BUTTON - clears the string line
eventBus.subscribe(EVENTS.GUI_CLEAR, () => {
    outline.reset();
});

// debug if enabled
eventBus.subscribe(EVENTS.GUI_DEBUG, () => {
    if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
    } else {
        scene.debugLayer.show();
    }
});





eventBus.subscribe(EVENTS.INSERT_MODEL, item => {
    const url = "http://localhost:3000";
    console.log("inserting model!");
    console.log(item.model);

    const lines = outline.getLines();
    console.log(`there are ${lines.length} points`);

    // check if model loaded, if so, create instance
    // otherwise load up the mesh

    const mesh = scene.getMeshByName(item.model.name);
    if(mesh) {
        console.log("mesh already exists, creating instance of it!");
        lines.forEach((point, index) => {
            const instance = mesh.createInstance(item.model.name + index);            
            instance.position = point;
            instance.isVisible = true;                
            shadowGenerator.addShadowCaster(instance);
        });

    } else{
        console.log("mesh doesn't yet exist, loading");
        SceneLoader.ImportMesh(
            "",
            url + item.model.path,
            item.model.file,
            scene,
            (meshes) => {
                console.log(meshes)
                // get our parent mesh... the parent...
                const mesh = meshes[0];
                mesh.name = item.model.name;
                mesh.isVisible = false;  
    
                // create instances on the basis of how many 
                // stringline points there are
                lines.forEach((point, index) => {
                    const instance = mesh.createInstance(item.model.name + index);
                    
                    instance.position = point;
                    instance.isVisible = true;                
                    shadowGenerator.addShadowCaster(instance);
                });
            });
    }

    



})


// listen for mouse right click, but if
// only we're in string line mode ....
canvas.addEventListener("contextmenu", () => {
    if (!getCameraActive(camera)) {
        const picked = scene.pick(scene.pointerX, scene.pointerY);
        if (picked.pickedMesh && picked.pickedMesh.name.substring(0, 4) == "post") {
            outline.delFencePostByName(picked.pickedMesh.name);
        } else {
            outline.addFencePost(picked.pickedPoint);
        }
    }
});

// the canvas/window resize event handler
window.addEventListener("resize", function () {
    engine.resize();
});


// run the renderloop
engine.runRenderLoop(function () {
    if (showfps) {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    }
    scene.render();
});