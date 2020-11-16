// required to polyfill async/await stuff in classes
// for browsers
import "@babylonjs/core/Culling/ray";
import "core-js";
import "regenerator-runtime/runtime";
import {
    Engine
} from "@babylonjs/core/Engines/engine";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { createCamera, createOutlineScene
} from "./modules/builder/scene";
import { StringLine } from "./modules/builder/stringLine";
import { EventBus } from "./modules/event/eventBus";
import { EVENTS } from "./modules/event/types";
import { initUI } from "./modules/UI";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    HighlightLayer
} from "@babylonjs/core/Layers/highlightLayer";


import {
    ShadowGenerator
} from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import {
    initCameraController,
    getCameraActive,
} from "./modules/controllers/camera";

import {
    initModelController
} from "./modules/controllers/model";
import {
    initKeyboard
} from "./modules/UI/controllers/keyboard";
import {
    initMouseController
} from "./modules/UI/controllers/mouse";

import { initFileController} from "./modules/controllers/file";

// init this part of the app
const eventBus = new EventBus();
// the canvas we're rendering too...
const canvas = document.getElementById("renderCanvas");

const engine = new Engine(canvas, true, {
    stencil: true,
});
const scene = createOutlineScene(engine, {
    stencil: true
});
const adt = new AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
const camera = createCamera(canvas, scene);
const shadowGenerator = new ShadowGenerator(2048, scene.getLightByName("sun"));

shadowGenerator.usePoissonSampling = true;

// drag and drop stuff
//
// highlight layer for highlighting selected meshes
const highlightLayer = new HighlightLayer("hl1", scene);

///   end of  drag drop stuff



//  Frames Per Second counter for profiling
const divFps = document.getElementById("fps");
const showfps = 1;

// init the string-line, this is the principle tool for modifying our
// garden
const outline = new StringLine(scene, adt, false, eventBus);


initCameraController(camera, canvas, eventBus, scene);
initModelController(
    eventBus,
    scene,
    outline,
    shadowGenerator,
    "http://localhost:3000", adt
);
initKeyboard(scene, eventBus);


initMouseController(scene, eventBus);

// save and load etc..
initFileController(scene, eventBus);

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

// listen for mouse right click, but if
// only we're in string line mode ....
canvas.addEventListener("contextmenu", () => {
    if (!getCameraActive(camera)) {
        const picked = scene.pick(scene.pointerX, scene.pointerY);
        if (
            picked.pickedMesh &&
            picked.pickedMesh.name.substring(0, 4) == "post"
        ) {
            outline.delFencePostByName(picked.pickedMesh.name);
        } else {
            outline.addFencePost(picked.pickedPoint);
        }
    }
});

// set a default mode
eventBus.dispatch(EVENTS.MODE_EDIT);


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