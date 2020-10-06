import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/loaders";
import "@babylonjs/core/Loading/loadingScreen";
// import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
// import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
// import { Vector3 } from "@babylonjs/core/Maths/math";
// import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
// import { Color3 } from "@babylonjs/core/Maths/math.color";
// //import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
// import { VertexBuffer } from "@babylonjs/core/meshes"

//import { PlaneRotationGizmo } from "@babylonjs/core/Gizmos/planeRotationGizmo";
import { Engine } from "@babylonjs/core/Engines/engine";
import {
  createScene,
  createCamera,
  createAltScene,
  createOutlineScene,
} from "./modules/scene";
import { button, rangeSlider } from "./modules/guiComponents";
import { StringLine } from "./modules/stringLine"

import { RibbonFence } from "./modules/ribbonFence"
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
var counter = 0;

// attach camera to scene to start off with...
camera.attachControl(canvas, false);

let divFps = document.getElementById("fps");
var showfps = 1;

//const outline = new Outline(scene, adt);

const outline = new StringLine(scene, adt, false)

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
  let lengths = outline.getLengths();

  var classType = outline.constructor.name;

  console.log("classtype: ", outline.constructor.name);
  console.log("super: ", outline);
  console.log(lengths)
})

eventBus.subscribe(EVENTS.GUI_BOUNDING, (payload) => {
  outline.updateExtents();
})


// KEEP POLYGON BUTTON
eventBus.subscribe(EVENTS.GUI_KEEP, (payload) => {
  let p = outline.getPolygon();
  if (p) {
    scene.addMesh(p);
  }
})


// TUBE!
eventBus.subscribe(EVENTS.GUI_TUBE, payload => {
  outline.getTubeFromLines();
})


// FENCE - currently making a fence!
eventBus.subscribe(EVENTS.GUI_FENCE, payload => {
  
   
   var f = new RibbonFence(outline);  

   if(payload.height && payload.height > 0.1 && payload.height < 10) {
     f.height = payload.height;
   }
   var mesh = f.getMesh();

   counter++;
   mesh.name = `fence${counter}`;
      
   scene.addMesh(mesh);
   mesh.material = scene.getMaterialByName("woodFence");      
  
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


// if we're in string line mode .... 
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
  button("btnFence", "Fence");
  rangeSlider("rngHeight", "height", 0, 4, .1);

$("#rngHeight").on('change', function(ev) {
    this.text = "freddo "
})

  $("#btnFence").on('click', ev => {
    var height = $("#rngHeight").val();
    eventBus.dispatch(EVENTS.GUI_FENCE, { height: height });
  })


  $("#btnTube").on('click', event => {
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




// utility method created by CeeJay on html5gameDevs
//

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