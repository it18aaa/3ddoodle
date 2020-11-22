// required to polyfill async/await stuff in classes
// for browsers
import "@babylonjs/core/Culling/ray";
import "core-js";
import "regenerator-runtime/runtime";

import {
    EVENTS
} from "./modules/event/types";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import {
    initState
} from "./modules/controllers/scene";
import {
    initEditor
} from "./modules/controllers/editor";
import {
    initUI
} from "./modules/UI";

const state = {};
state.canvas = document.getElementById("renderCanvas");
initState(state);

//  Frames Per Second counter for profiling
const divFps = document.getElementById("fps");
const showfps = 1;

initEditor(state);
initUI(state.bus);

// GET LENGTHS
state.bus.subscribe(EVENTS.GUI_LENGTH_BUTTON, () => {
    state.bus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
        lengths: state.outline.getLengths(),
        total: state.outline.totalLength,
    });
});

// CLEAR BUTTON - resents the stringline
state.bus.subscribe(EVENTS.GUI_CLEAR_STRINGLINE, () => {
    state.outline.reset();
});

// debug if enabled
state.bus.subscribe(EVENTS.GUI_DEBUG, () => {
    if (state.scene.debugLayer.isVisible()) {
        state.scene.debugLayer.hide();
    } else {
        state.scene.debugLayer.show();
    }
});

// set a default mode
state.bus.dispatch(EVENTS.MODE_EDIT);

// the canvas/window resize event handler
window.addEventListener("resize", function () {
    state.engine.resize();
});

state.running = true;

// run the renderloop
state.engine.runRenderLoop(function () {
    if (state.running) {
        if (showfps) {
            divFps.innerHTML = state.engine.getFps().toFixed() + " fps";
        }
        state.scene.render();
    }
});

