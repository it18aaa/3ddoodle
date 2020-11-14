import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { EVENTS } from "../event/types";
import { 
    initGroundController
} from "./ground";
import {
    initFenceController
} from "./fence";
import {
    UtilityLayerRenderer
} from "@babylonjs/core/Rendering/utilityLayerRenderer";
import {
    PointerDragBehavior
} from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
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
    TextBlock
} from "@babylonjs/gui/2D/controls/textBlock";
import {
    Counter 
} from "../utility/counter";

export function initModelController(eventBus, scene, outline, shadowGenerator, url, adt) {
    
    // a counter for unique naming, and a utility layer for 
    // labels
    const counter = new Counter();
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


    // initialise events for ground material and fences...
    initGroundController(eventBus, scene, outline);
    initFenceController(eventBus, scene, outline, shadowGenerator);

    let modelLabel = makeModelLabel("");
    modelLabel.isVisible = false;
    adt.addControl(modelLabel);
    // when a model is selected, add drag behaviour and attach
    // rotation gizmo
    eventBus.subscribe(EVENTS.MODEL_SELECT, item => {
        const selected = scene.getMeshByName(item.name);
        selected.addBehavior(pointerDragBehavior);
        gizmo.attachedMesh = selected;        
        modelLabel.text = selected.name;
        modelLabel.linkWithMesh(selected)
        modelLabel.isVisible = true;
    });


 

    // when a mdel is deslected, remove drag behaviour,
    // and detach gizmo
    eventBus.subscribe(EVENTS.MODEL_UNSELECT, item => {
        const unselected = scene.getMeshByName(item.name);
        unselected.removeBehavior(unselected.getBehaviorByName("PointerDrag"));
        gizmo.attachedMesh = null;
        modelLabel.text = "";
        modelLabel.linkWithMesh(null);
        modelLabel.isVisible = false;
    });

    eventBus.subscribe(EVENTS.MODEL_DELETE, item => {
        console.log("Delete ", item);
        const unselected = scene.getMeshByName(item.name);

    });

    eventBus.subscribe(EVENTS.MODEL_ADD, item => {
        const lines = outline.getLines();

        // check if model loaded, if so, create instance
        // otherwise load up the mesh
        const mesh = scene.getMeshByName(item.model.name);
        if (mesh) {
            // mesh already exists, creating instance of it!
            counter.increment();
            lines.forEach((point, index) => {
                const instance = mesh.createInstance(item.model.name + counter.get() + index);
                instance.position = point;
                instance.isVisible = true;
                shadowGenerator.addShadowCaster(instance);
            });

        } else {
            //  mesh doesn't yet exist, so load it 
            SceneLoader.ImportMesh(
                "",
                url + item.model.path,
                item.model.file,
                scene,
                (meshes) => {
                    console.log(meshes)
                    // get our parent mesh... the parent...
                    const mesh = meshes[0];
                    counter.increment();
                    mesh.name = item.model.name + counter.get();
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
}

function makeModelLabel(name) {
    const label = new TextBlock("selectedLabel", "")
    label.outlineColor = "black";
    label.outlineWidth = 4;
    label.fontSize = 22;
    label.color = "white";
    label.alpha = 0.7;
    label.linkOffsetX = 0;
    label.linkOffsetY = -30;
    return label;
}