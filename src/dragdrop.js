//needed for picking
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/loaders";
import "@babylonjs/core/Loading/loadingScreen";
import {
    Engine
} from "@babylonjs/core/Engines/engine";
import {
    createScene,
    createCamera,
    createAltScene
} from "./modules/scene";
import $ from "jquery";
import {
    PointerEventTypes
} from "@babylonjs/core/Events/pointerEvents";
import {
    Color3
} from "@babylonjs/core/Maths/math.color";
import {
    PointerDragBehavior
} from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import {
    HighlightLayer
} from "@babylonjs/core/Layers/highlightLayer";
import {
    Vector3
} from "@babylonjs/core/Maths/math";
import {
    UtilityLayerRenderer
} from "@babylonjs/core/Rendering/utilityLayerRenderer";
import {
    PlaneRotationGizmo
} from "@babylonjs/core/Gizmos/planeRotationGizmo";

// this lot is global, but shouldn't be.


const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true, {
    stencil: true
});

let divFps = document.getElementById("fps");
const scene = createScene(engine);

const highlightLayer = new HighlightLayer("hl1", scene);
const utilLayer = new UtilityLayerRenderer(scene);

const gizmo = new PlaneRotationGizmo(
    new Vector3(0, 1, 0),
    Color3.FromHexString("#00FF00"),
    utilLayer
);
 
const camera = createCamera(canvas, scene);
camera.attachControl(canvas, false);
 
const altScene = createAltScene(engine);
const altCamera = createCamera(canvas, altScene);

// even more globals - bad need putting in an object?
let showfps = true;
const appState = {};
appState.viewState = 0;
 

function changeMode(mode = 0) {
    switch (mode) {
        case 0: {
            appState.viewState = 0;
            break;
        }
        case 1: {
            appState.viewState = 1;
            break;
        }
        default: {
            appState.viewState = 0;
        }
    }
}

class modeManager {
    _mode;
    _selectedMesh;

    prototype() {
        this._mode=0;
        this._selectedMesh = null;
    }

    getSelected() {

    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        // mode validation
    }

    getSelectedMesh() {
        return this._selectedMesh;
    }

}

// drag behaviour ?
const pointerDragBehavior = new PointerDragBehavior({
    dragPlaneNormal: new Vector3(0, 1, 0),
});
console.log("behaviour name =  ", pointerDragBehavior.name);

// view state one, draw stuff!
if (appState.viewState == 0) {
    // selecting stuff!
    let selected = null;

    scene.onPointerObservable.add(function (evt) {
        console.log(evt);

        // you clicked on a mesh
        if (
            evt.pickInfo.hit &&
            evt.pickInfo.pickedMesh &&
            evt.event.button === 0 &&
            evt.pickInfo.pickedMesh.name !== "ground1"
        ) {
            if (!selected) {
                selected = evt.pickInfo.pickedMesh;
                selected.addBehavior(pointerDragBehavior);
                highlightLayer.addMesh(selected, Color3.White());
                gizmo.attachedMesh = selected;
            } else if (selected && evt.pickInfo.pickedMesh.name != selected.name) {
                selected.removeBehavior(selected.getBehaviorByName("PointerDrag"));
                highlightLayer.removeMesh(selected);

                selected = evt.pickInfo.pickedMesh;
                selected.addBehavior(pointerDragBehavior);
                highlightLayer.addMesh(selected, Color3.White());
                gizmo.attachedMesh = selected;
            }
        } else if (selected) {
            selected.removeBehavior(selected.getBehaviorByName("PointerDrag"));
            highlightLayer.removeMesh(selected);
            selected = null;
            gizmo.attachedMesh = null;
        } else {}
    }, PointerEventTypes.POINTERDOWN);
} else if (appState.viewState == 1) {

    // draw the polygon stuff!
    // not going to work, needs attaching to event

    scene.onPointerObserverable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                console.log("Pointer DOWN!");
                break;
            case PointerEventTypes.POINTERUP:
                console.log("Pointer Up!");
                break;
            default:
                break;
        }
    })
}


$(".button-container").remove();


$("body").append('<div class="button-container">Garden Designer! </div>');



function button(id, text, container = "button-container") {
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);
}


function rangeSlider(
    id,
    min = 0,
    max = 10,
    step = 1,
    container = "button-container"
) {
    $(`.${container}`).append(
        `<input id='${id}' type='range' min=${min} max=${max} step=${step}></input>`
    );
}

button("btn-up", "UP");
button("btn-down", "DOWN");
button("btnGrid", "Grid");
rangeSlider("rngY", -10, 30, 1);
rangeSlider("rngSpherePos", -30, 30, 0.1);
button("btnScene", "Scene");
button("btnMouse", "Mouse");
button("btnFPS", "Show FPS");

$("#btn-up").click(() => {
    if (selected) {
        selected.position.y += 0.1;
    }
});

$("#btnFPS").click(() => {
    if (showfps) {
        $("#fps").hide();
    } else {
        $("#fps").show();
    }
    showfps = !showfps;
});

$("#btnMouse").click(() => {
    // if there is no input attached to the camera, add some

    if (camera.inputs.attachedElement !== null) {
        camera.detachControl(canvas);
        $("#btnMouse").css("background-color", "#AAAAAA");
    } else {
        $("#btnMouse").css("background-color", "white");
        camera.attachControl(canvas);
    }

    console.log(camera.inputs.attachedElement);
    console.log(camera.inputs);
});

$("#btn-down").click(() => {
    //alert("Presto!");
    //   let sphere = scene.getMeshByName("sphere");
    //   sphere.position.y -= 0.1;

    if (selected) {
        selected.position.y -= 0.1;
    }
});

$("#btnGrid").click(() => {
    const ground = scene.getMeshByName("ground1");
    const gridMaterial = scene.getMaterialByName("gridMaterial");
    const grassMaterial = scene.getMaterialByName("grassMaterial");

    if (ground.material === gridMaterial) {
        ground.material = grassMaterial;
    } else {
        ground.material = gridMaterial;
    }
});

$("#rngY").on("change mousemove", function () {
    const dlight = scene.getLightByName("DirectionalLight");
    let y = $(this).val();

    dlight.direction.x = y;
    dlight.direction.z = y;
});

$("#rngSpherePos").on("change mousemove", function () {
    const sphere = scene.getMeshByName("sphere");

    let y = $(this).val();
    sphere.position.x = y;
});

$("#btnScene").click(() => {
    if (appState.viewState == 0) {
        appState.viewState = 1;
        $("#btnScene").text("scene " + appState.viewState);

        altCamera.radius = camera.radius;
        altCamera.alpha = camera.alpha;
        altCamera.beta = camera.beta;
        altCamera.target = camera.target;

        camera.detachControl(canvas, false);
        altCamera.attachControl(canvas, false);
    } else if (appState.viewState == 1) {
        appState.viewState = 0;
        $("#btnScene").text("scene " + appState.viewState);

        camera.radius = altCamera.radius;
        camera.alpha = altCamera.alpha;
        camera.beta = altCamera.beta;
        camera.target = altCamera.target;

        altCamera.detachControl(canvas, false);
        camera.attachControl(canvas, false);
    }
    console.log("state: ", appState.viewState);
});

// run the renderloop
engine.runRenderLoop(function () {
    if (showfps) {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    }

    if (appState.viewState == 0) {
        scene.render();
    } else {
        altScene.render();
    }
});

// the canvas/window resize event handler
window.addEventListener("resize", function () {
    engine.resize();
});