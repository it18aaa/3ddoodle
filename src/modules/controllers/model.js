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

export function initModelController(eventBus, state, outline, shadowGenerator, url, adt) {
    
    // a counter for unique naming, and a utility layer for 
    // labels
    const counter = new Counter();
    const utilityLayer = new UtilityLayerRenderer(state.scene);

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
    initGroundController(eventBus, state, outline);
    initFenceController(eventBus, state, outline, shadowGenerator);

    // label for drag and drop
    let modelLabel = makeModelLabel("");
    modelLabel.isVisible = false;
    adt.addControl(modelLabel);

    // selection
    let selected = null;


    // when a model is selected, add drag behaviour and attach
    // rotation gizmo
    eventBus.subscribe(EVENTS.MODEL_SELECT, item => {        
        selected = item.id;
        const mesh = state.scene.getMeshByUniqueID(item.id);
        mesh.addBehavior(pointerDragBehavior);
        gizmo.attachedMesh = mesh;        
        modelLabel.text = mesh.name;
        modelLabel.linkWithMesh(mesh)
        modelLabel.isVisible = true;
    });


    // when a mdel is deslected, remove drag behaviour,
    // and detach gizmo
    eventBus.subscribe(EVENTS.MODEL_UNSELECT, item => {
        if(selected) {
            selected = null;
            const mesh = state.scene.getMeshByUniqueID(item.id);
            mesh.removeBehavior(mesh.getBehaviorByName("PointerDrag"));
            gizmo.attachedMesh = null;
            modelLabel.text = "";
            modelLabel.linkWithMesh(null);
            modelLabel.isVisible = false;
        }        
    });


    // when camera mode is engaged, we need to deselected any selected
    // meshes, otherwise drag controls will clash with camera controls
    // and models will slide around 
    eventBus.subscribe(EVENTS.MODE_CAMERA, ()=> {
        if(selected) {
            eventBus.dispatch(EVENTS.MODEL_UNSELECT, { id: selected})
        }
    });

    //
    eventBus.subscribe(EVENTS.DELETE_REQUEST, ()=> {
        // do we have a model selected?
        if(selected) {
            const mesh = state.scene.getMeshByUniqueID(selected);
            eventBus.dispatch(EVENTS.DELETE_CONFIRM, 
                {
                    id: selected,
                    name: mesh.name
                });
        };
    });



    eventBus.subscribe(EVENTS.DELETE_DO, item => {
        console.log("Delete ", item);
        const unselected = state.scene.getMeshByUniqueID(item.id);
        unselected.removeBehavior(unselected.getBehaviorByName("PointerDrag"));
        selected = null;
        modelLabel.text = "";
        modelLabel.isVisible = false;
        gizmo.attachedMesh =null;
        state.scene.removeMesh(unselected);
        unselected.dispose();
    });

    eventBus.subscribe(EVENTS.MODEL_ADD, item => {
        const lines = outline.getLines();

        // check if model loaded, if so, create instance
        // otherwise load up the mesh
        const mesh = state.scene.getMeshByName(item.model.name);
        if (mesh) {
            // mesh already exists, creating instance of it!
            counter.increment();
            lines.forEach((point, index) => {
                const instance = mesh.createInstance(`${item.model.name}.${counter.get().toString()}.${index}`);
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
                state.scene,
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
                        const instance = mesh.createInstance(`${item.model.name}.${counter.get().toString()}.${index}`);

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