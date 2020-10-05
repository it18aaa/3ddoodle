import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/loaders";
import "@babylonjs/core/Loading/loadingScreen";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { Color3 } from "@babylonjs/core/Maths/math.color";
//import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";

//import { PlaneRotationGizmo } from "@babylonjs/core/Gizmos/planeRotationGizmo";
import { Engine } from "@babylonjs/core/Engines/engine";
import {
  createScene,
  createCamera,
  createAltScene,
  createOutlineScene,
} from "./modules/scene";
import { button, rangeSlider } from "./modules/guiComponents";
import { Outline } from "./modules/outline"
import { EVENTS, EventBus } from "./modules/eventBus";
import $, { get } from "jquery";
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";

// init this part of the app
const eventBus = new EventBus();

const canvas = document.getElementById("renderCanvas");


const engine = new Engine(canvas, true, {
  stencil: true,
});

const scene = createOutlineScene(engine);
const adt = new AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
const camera = createCamera(canvas, scene);

// attach camera to scene to start off with...
camera.attachControl(canvas, false);

let divFps = document.getElementById("fps");
var showfps = 1;

const outline = new Outline(scene, adt);


scene.registerBeforeRender(function () {
  outline.updateMesh();
});

drawGui();



// run the renderloop
engine.runRenderLoop(function () {
  if (showfps) {
    divFps.innerHTML = engine.getFps().toFixed() + " fps";
  }
  scene.render();
});

function getCameraActive() {
  return camera.inputs.attachedElement ? true : false;
}


// CREATE POLYGON BUTTON
eventBus.subscribe(EVENTS.GUI_POLYGON, (payload) => {
  outline.getPolygonFromLines();
})

// CLEAR BUTTON
eventBus.subscribe(EVENTS.GUI_CLEAR, (payload) => {
  outline.reset();
})


// GET LENGTHS BUTTON
eventBus.subscribe(EVENTS.GUI_LENGTH_BUTTON, (payload) => {
  outline.getLengths();
})

eventBus.subscribe(EVENTS.GUI_BOUNDING, (payload) => {
  outline.updateExtents();
})


// KEEP POLYGON BUTTON
eventBus.subscribe(EVENTS.GUI_KEEP, (payload) => {
  scene.addMesh(outline.getPolygon());
})


// TUBE!
eventBus.subscribe(EVENTS.GUI_TUBE, payload=> {
  outline.getTubeFromLines();  
})

// Shape
eventBus.subscribe(EVENTS.GUI_SHAPE, payload=> {
  // outline.getWallFromLines();  
  outline.getStuffFromLines();
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

canvas.addEventListener("contextmenu", (evt) => {

  let picked = scene.pick(scene.pointerX, scene.pointerY);

  if (picked.pickedMesh && picked.pickedMesh.name.substring(0, 4) == "post") {
    outline.delFencePostByName(picked.pickedMesh.name)
  } else {
    outline.addFencePost(picked.pickedPoint);
  }

});

// the canvas/window resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});

function drawGui() {

  $(".button-container").remove();

  $("body").append('<div class="button-container">Garden Designer! </div>');

  let cam_default = "Camera Mode";
  button("btnFreezeCamera", cam_default);
  button("btnPolygon", "Polygon");
  button("btnClear", "Clear");
  button("btnLength", "Lengths");
  button("btnKeep", "Keep");
  button("btnBounding", "Bounding Box");
  button("btnTube", "Tube");
  button("btnShape", "Shape");
  rangeSlider("rngHeight", 0, 4, .1);

  $("#btnShape").on('click', ev=>{
    eventBus.dispatch(EVENTS.GUI_SHAPE);
  })

  $("#btnTube").on('click', event=>{
    eventBus.dispatch(EVENTS.GUI_TUBE);
  });

  $("#btnBounding").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_BOUNDING);
  })

  // freeze camera button
  $("#btnFreezeCamera").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_CAMERA_FREEZE_TOGGLE);
  });

  $("#btnPolygon").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_POLYGON);
  });

  $("#btnClear").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_CLEAR);
  });

  $("#btnLength").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_LENGTH_BUTTON)
  });

  $("#btnKeep").on('click', (event) => {
    eventBus.dispatch(EVENTS.GUI_KEEP);
  });

  // change icon when camera is frozen
  eventBus.subscribe(EVENTS.CAMERA_FROZEN, (payload) => {
    $("#btnFreezeCamera").text("Draw Mode");
    console.log("Draw Mode: Use the mouse to draw the outline of your garden")
  });

  eventBus.subscribe(EVENTS.CAMERA_UNFROZEN, (payload) => {
    $("#btnFreezeCamera").text(cam_default);
    console.log("Camera Mode: use the mouse to move the camera around the scene")
  });
}
