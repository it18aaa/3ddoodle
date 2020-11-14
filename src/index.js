// required to polyfill async/await stuff in classes
// for browsers
import "@babylonjs/core/Culling/ray";
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
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import {
    PointerDragBehavior
} from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import {
    PointerEventTypes
} from "@babylonjs/core/Events/pointerEvents";
import {
    HighlightLayer
} from "@babylonjs/core/Layers/highlightLayer";
import {
    Vector3
} from "@babylonjs/core/Maths/math.vector";
import {
    Color3
} from "@babylonjs/core/Maths/math.color";
import {
    PlaneRotationGizmo
} from "@babylonjs/core/Gizmos/planeRotationGizmo";
import {
    UtilityLayerRenderer
} from "@babylonjs/core/Rendering/utilityLayerRenderer";
import {
    ShadowGenerator
} from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import {
    initCameraController,
    getCameraActive,
} from "./modules/controllers/camera";
import {
    initGroundController
} from "./modules/controllers/ground";
import {
    initFenceController
} from "./modules/controllers/fence";
import {
    initModelController
} from "./modules/controllers/model";
import {
    KeyboardEventTypes
} from "@babylonjs/core/Events/keyboardEvents";

// init this part of the app
const eventBus = new EventBus();
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
const utilityLayer = new UtilityLayerRenderer(scene);

// drag behaviour for garden items!
const pointerDragBehavior = new PointerDragBehavior({
    dragPlaneNormal: new Vector3(0, 1, 0),
});
//  rotation gizmo for rotating selected meshes
const gizmo = new PlaneRotationGizmo(
    new Vector3(0, 1, 0),
    Color3.FromHexString("#FF44FF"),
    utilityLayer
);
gizmo.sensitivity = 14;
///   end of  drag drop stuff



//  Frames Per Second counter for profiling
const divFps = document.getElementById("fps");
const showfps = 1;

// init the string-line, this is the principle tool for modifying our
// garden
const outline = new StringLine(scene, adt, false, eventBus);

initGroundController(eventBus, scene, outline);
initFenceController(eventBus, scene, outline, shadowGenerator);
initCameraController(camera, canvas, eventBus, scene);
initModelController(
    eventBus,
    scene,
    outline,
    shadowGenerator,
    "http://localhost:3000"
);

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
eventBus.dispatch(EVENTS.MODE_EDIT );

// keyboard behaviour
scene.onKeyboardObservable.add((kbInfo) => {

    if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        switch (kbInfo.event.key) {
            case "Delete":
            case "Backspace":
                eventBus.dispatch(EVENTS.KEYBOARD_DELETE);
                break
            case "m":
            case "M":
                console.log("mmmmmmm")
                eventBus.dispatch(EVENTS.MODE_TOGGLE);
                break;
                
        }
    }

    // if (kbInfo.type === KeyboardEventTypes.KEYUP) {
    //     if (selected) {
    //         shadowGenerator.removeShadowCaster(selected);
    //         gizmo.attachedMesh = null;
    //         scene.removeMesh(selected);
    //     }
    // }
});


let selected = null;
// call back for the drag and drop stuff
// requires - selected mesh, gizmo
function dragAndDropFunctionality(evt) {
    if (
        evt.pickInfo.hit &&
        evt.pickInfo.pickedMesh &&
        evt.event.button === 0 &&
        evt.pickInfo.pickedMesh.name !== "ground1"
    ) {

        // if nothing is selected
        if (!selected) {
            selected = evt.pickInfo.pickedMesh;
            console.log(selected);
            selected.addBehavior(pointerDragBehavior);
            //    highlightLayer.addMesh(selected, Color3.White());
            gizmo.attachedMesh = selected;
        } else if (selected && evt.pickInfo.pickedMesh.name != selected.name) {

            selected.removeBehavior(selected.getBehaviorByName("PointerDrag"));
            //    highlightLayer.removeMesh(selected);
            selected = evt.pickInfo.pickedMesh;
            selected.addBehavior(pointerDragBehavior);
            //    highlightLayer.addMesh(selected, Color3.White());
            gizmo.attachedMesh = selected;
        }
    } else if (selected) {
        selected.removeBehavior(selected.getBehaviorByName("PointerDrag"));
        // highlightLayer.removeMesh(selected);
        selected = null;
        gizmo.attachedMesh = null;
    }
}

scene.onPointerObservable.add(
    dragAndDropFunctionality,
    PointerEventTypes.POINTERDOWN
);

// scene.onPointerObservable.remove(
//     dragAndDropFunctionality,
//     PointerEventTypes.POINTERDOWN
// );

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