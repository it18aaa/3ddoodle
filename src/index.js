// required to polyfill async/await stuff in classes
// for browsers
import "@babylonjs/core/Culling/ray";
import "core-js";
import "regenerator-runtime/runtime";
import { EVENTS } from "./modules/event/types";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { initState } from "./modules/controllers/scene";
import { initEditor } from "./modules/controllers/editor";
import { initUI } from "./modules/UI";

// state container
const state = {};
state.canvas = document.getElementById("renderCanvas");
initState(state);
initEditor(state);
initUI(state.bus);

// set a default mode
state.bus.dispatch(EVENTS.MODE_EDIT);

// the canvas/window resize event handler
window.addEventListener("resize", function () {
    state.engine.resize();
});

// set running state
state.running = true;

state.bus.dispatch(EVENTS.SHOW_SPLASH);

state.engine.runRenderLoop(function () {
    if (state.running) {        
        state.scene.render();
    }
});

