// required to polyfill async/await stuff in classes
// for browsers
import "@babylonjs/core/Culling/ray";
import "core-js";
import "regenerator-runtime/runtime";
import { Engine } from "@babylonjs/core/Engines/engine";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { createCamera, createOutlineScene } from "./modules/builder/scene";
import { StringLine } from "./modules/builder/stringLine";
import { EventBus } from "./modules/event/eventBus";
import { EVENTS } from "./modules/event/types";
import { initUI } from "./modules/UI";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";

import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import {
    initCameraController,
    getCameraActive,
} from "./modules/controllers/camera";

import { initModelController } from "./modules/controllers/model";
import { initKeyboard } from "./modules/UI/controllers/keyboard";
import { initMouseController } from "./modules/UI/controllers/mouse";
import { initFileController } from "./modules/controllers/file";

const state = {};

// init this part of the app
const eventBus = new EventBus();
// the canvas we're rendering too...
const canvas = document.getElementById("renderCanvas");

const engine = new Engine(canvas, true, {
    stencil: true,
});


state.scene = createOutlineScene(engine, {
    stencil: true,
});

const adt = new AdvancedDynamicTexture.CreateFullscreenUI(
    "UI",
    true,
    state.scene
);
const camera = createCamera(canvas, state.scene);
const shadowGenerator = new ShadowGenerator(
    2048,
    state.scene.getLightByName("sun")
);

shadowGenerator.usePoissonSampling = true;
state.shadowGenerator = shadowGenerator;

//  Frames Per Second counter for profiling
const divFps = document.getElementById("fps");
const showfps = 1;


// init the string-line, this is the principle tool for modifying our
// garden
const outline = new StringLine(state, adt, false, eventBus);

function init(engine, camera, eventBus, canvas, state, shadowGenerator, outline, adt) {
    initCameraController(camera, canvas, eventBus, state.scene, state);
    initModelController(
        eventBus,
        state,
        outline,
        shadowGenerator,
        "http://localhost:3000",
        adt
    );
    initKeyboard(state.scene, eventBus);
    initMouseController(state, eventBus);
    initFileController(state, eventBus, engine); // pass in state
    initUI(eventBus);
}

init(engine, camera, eventBus, canvas, state, shadowGenerator, outline, adt);



// GET LENGTHS
eventBus.subscribe(EVENTS.GUI_LENGTH_BUTTON, () => {
    eventBus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
        lengths: outline.getLengths(),
        total: outline.totalLength,
    });
});

// CLEAR BUTTON - resents the stringline
eventBus.subscribe(EVENTS.GUI_CLEAR, () => {
    outline.reset();
});

// debug if enabled
eventBus.subscribe(EVENTS.GUI_DEBUG, () => {
    if (state.scene.debugLayer.isVisible()) {
        state.scene.debugLayer.hide();
    } else {
        state.scene.debugLayer.show();
    }
});

// listen for mouse right click, but if
// only we're in string line mode ....
canvas.addEventListener("contextmenu", () => {
    const scene = state.scene;
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
    state.scene.render();
});
