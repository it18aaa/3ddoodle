import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { EVENTS } from "../event/types";
import { 
    initGroundController
} from "./ground";
import {
    initFenceController
} from "./fence";

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

export function initModelController(state) {
    
    // a counter for unique naming, and a utility layer for 
    // labels
    state.nameCounter = new Counter();
    // const utilityLayer = state.utilityLayer;
    // const adt = state.adt;

    // drag behaviour for garden items!
    const pointerDragBehavior = new PointerDragBehavior({
        dragPlaneNormal: new Vector3(0, 1, 0),
    });

    //  rotation gizmo for rotating selected meshes
    const gizmo = new PlaneRotationGizmo(
        new Vector3(0, 1, 0),
        Color3.FromHexString("#FF44FF"),
        state.utilityLayer
    );
    gizmo.sensitivity = 14;


    // initialise events for ground material and fences...
    initGroundController(state);
    initFenceController(state);

    // label for drag and drop stuff, just stays in state
    state.modelLabel = makeModelLabel("");
    state.modelLabel.isVisible = false;
    state.adt.addControl(state.modelLabel);

    // selection
    // let selected = null;


    // when a model is selected, add drag behaviour and attach
    // rotation gizmo
    state.bus.subscribe(EVENTS.MODEL_SELECT, item => {        
        state.selected = item.id;
        const mesh = state.scene.getMeshByUniqueID(item.id);
        mesh.addBehavior(pointerDragBehavior);
            gizmo.attachedMesh = mesh;        
        state.modelLabel.text = mesh.name;
        state.modelLabel.linkWithMesh(mesh)
        state.modelLabel.isVisible = true;
    });


    // when a mdel is deslected, remove drag behaviour,
    // and detach gizmo
    state.bus.subscribe(EVENTS.MODEL_UNSELECT, item => {
        if(state.selected) {
            const mesh = state.scene.getMeshByUniqueID(state.selected);
            state.selected = null;
            mesh.removeBehavior(mesh.getBehaviorByName("PointerDrag"));
            gizmo.attachedMesh = null;
            state.modelLabel.text = "";
            state.modelLabel.linkWithMesh(null);
            state.modelLabel.isVisible = false;
        }        
    });


    // when camera mode is engaged, we need to deselected any selected
    // meshes, otherwise drag controls will clash with camera controls
    // and models will slide around 
    state.bus.subscribe(EVENTS.MODE_CAMERA, ()=> {
        if(state.selected) {
            state.bus.dispatch(EVENTS.MODEL_UNSELECT, { id: state.selected})
        }
    });

    //
    state.bus.subscribe(EVENTS.DELETE_REQUEST, ()=> {
        // do we have a model selected?
        if(state.selected) {
            const mesh = state.scene.getMeshByUniqueID(state.selected);
            state.bus.dispatch(EVENTS.DELETE_CONFIRM, 
                {
                    id: state.selected,
                    name: mesh.name
                });
        };
    });



    state.bus.subscribe(EVENTS.DELETE_DO, item => {
        console.log("Delete ", item);
        const unselected = state.scene.getMeshByUniqueID(item.id);
        unselected.removeBehavior(unselected.getBehaviorByName("PointerDrag"));
        state.selected = null;
        state.modelLabel.text = "";
        state.modelLabel.isVisible = false;
        gizmo.attachedMesh =null;
        state.scene.removeMesh(unselected);
        unselected.dispose();
    });

    state.bus.subscribe(EVENTS.MODEL_ADD, item => {
        const lines = state.outline.getLines();

        // check if model loaded, if so, create instance
        // otherwise load up the mesh
        const mesh = state.scene.getMeshByName(item.model.name);
        if (mesh) {
            // mesh already exists, creating instance of it!
            state.nameCounter.increment();
            lines.forEach((point, index) => {
                const instance = mesh.createInstance(`${item.model.name}.${state.nameCounter.get().toString()}.${index}`);
                instance.position = point;
                instance.isVisible = true;
                state.shadowGenerator.addShadowCaster(instance);
            });

        } else {
            //  mesh doesn't yet exist, so load it 
            SceneLoader.ImportMesh(
                "",
                state.url + item.model.path,
                item.model.file,
                state.scene,
                (meshes) => {
                    console.log(meshes)
                    // get our parent mesh... the parent...
                    const mesh = meshes[0];
                    state.nameCounter.increment();
                    mesh.name = item.model.name + state.nameCounter.get();
                    mesh.isVisible = false;

                    // create instances on the basis of how many 
                    // stringline points there are
                    lines.forEach((point, index) => {
                        const instance = mesh.createInstance(`${item.model.name}.${state.nameCounter.get().toString()}.${index}`);

                        instance.position = point;
                        instance.isVisible = true;
                        state.shadowGenerator.addShadowCaster(instance);
                    });
                });
        }
    });

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