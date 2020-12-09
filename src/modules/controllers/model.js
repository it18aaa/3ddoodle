import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { EVENTS } from "../event/types";
import { initGroundController } from "./ground";
import { initFenceController } from "./fence";

import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PlaneRotationGizmo } from "@babylonjs/core/Gizmos/planeRotationGizmo";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Counter } from "../utility/counter";

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
    state.bus.subscribe(EVENTS.MODEL_SELECT, (item) => {
        state.selected = item.id;
        const mesh = state.scene.getMeshByUniqueID(item.id);
        mesh.addBehavior(pointerDragBehavior);
        gizmo.attachedMesh = mesh;
        state.modelLabel.text = mesh.name;
        state.modelLabel.linkWithMesh(mesh);
        state.modelLabel.isVisible = true;
    });

    // when a mdel is deslected, remove drag behaviour,
    // and detach gizmo
    state.bus.subscribe(EVENTS.MODEL_UNSELECT, (item) => {
        if (state.selected) {
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
    state.bus.subscribe(EVENTS.MODE_CAMERA, () => {
        if (state.selected) {
            state.bus.dispatch(EVENTS.MODEL_UNSELECT, { id: state.selected });
        }
    });

    //
    state.bus.subscribe(EVENTS.DELETE_REQUEST, () => {
        // do we have a model selected?
        if (state.selected) {
            const mesh = state.scene.getMeshByUniqueID(state.selected);
            state.bus.dispatch(EVENTS.DELETE_CONFIRM, {
                id: state.selected,
                name: mesh.name,
            });
        }
    });

    state.bus.subscribe(EVENTS.DELETE_DO, (item) => {
        console.log("Delete ", item);
        const unselected = state.scene.getMeshByUniqueID(item.id);
        unselected.removeBehavior(unselected.getBehaviorByName("PointerDrag"));
        state.selected = null;
        state.modelLabel.text = "";
        state.modelLabel.isVisible = false;
        gizmo.attachedMesh = null;
        state.scene.removeMesh(unselected);
        // is instance in dynamicmodels?
        if(state.scene.metadata.dynamicModels.includes(item.id)) {
            // if so filter it out
            state.scene.metadata.dynamicModels = state.scene.metadata.dynamicModels.filter(id => id !== item.id);
            state.scene.metadata.dynamicModelData = state.scene.metadata.dynamicModels.filter(id => id !== item.id);

        }

        unselected.dispose();
    });

    state.bus.subscribe(EVENTS.MODEL_ADD, (item) => {
        switch (item.model.type) {
            case "dynamic":
                addDynamicModels(item);
                break;
            case "static":
                addStaticModels(item);
                break;
        }
    });

    async function addDynamicModels(item) {
        const baseMesh = await getBaseMesh(item);
        if(!baseMesh) {
            console.log("There was an issue loading the mess. ", baseMesh, item);
            return;
        }        
        makeInstances(baseMesh, item);
    }

    async function addStaticModels(item) {
         const baseMesh = await getBaseMesh(item);
        if (baseMesh) {
            console.log(baseMesh);
            makeInstances(baseMesh, item);
        } else {
            console.log("There was an issue loading the mesh.", baseMesh, item);
        }
    }

    async function getBaseMesh(item) {
        let mesh = state.scene.getMeshByName(item.model.name);
        if (!mesh) {
            let result = await SceneLoader.ImportMeshAsync(
                "",
                state.url + item.model.path,
                item.model.file,
                state.scene
            );

            mesh = result.meshes[0];
            mesh.name = item.model.name;
            mesh.isVisible = false;
            console.log(mesh);      
        }
        return mesh ? mesh : null;
    }


    function getCentreOfScreen() {
        const ray = state.scene.activeCamera.getForwardRay();
            const pickingInfo = ray.intersectsMesh(
                state.scene.getMeshByName("ground1")
            );
            return pickingInfo.pickedPoint;
    }

    function makeInstances(mesh, item) {
        // retrieve the stringline locations
        const positions = state.outline.getLines();

        // if there aren't any, try middle of screen
        if (positions.length == 0) {            
            positions[0] = getCentreOfScreen();
        }

        const name = item.model.name;

        
        const num = state.nameCounter.get().toString();
        state.nameCounter.increment();
        
        if (positions.length > 0) {            
            positions.forEach((position, index) => {
                const inst = mesh.createInstance(`${name}.${num}.${index}`);
                // if the model is dynamic, put it in the dynamic models array
                if(item.model.type == "dynamic") {
                    // console.log(inst.uniqueId);
                    // console.log(inst.name);  // use name inste

                    // using name instead of uniqueID, as uniqueID can change
                    // when file is saved and reopened!
                    state.scene.metadata.dynamicModels.push(inst.name);
                    // growth info is in here, so just lump it on the 

                    state.scene.metadata.dynamicModelData.push({
                        name: inst.name,
                        data: item.model
                    })
                    // instances metadata
                    // inst.metadata = item;
                }                                
                inst.position = position;
                inst.isVisible = true;
                state.shadowGenerator.addShadowCaster(inst);
            });
        }        
        console.log(state.scene)
    }
}



function makeModelLabel(name) {
    const label = new TextBlock("selectedLabel", "");
    label.outlineColor = "black";
    label.outlineWidth = 4;
    label.fontSize = 22;
    label.color = "white";
    label.alpha = 0.7;
    label.linkOffsetX = 0;
    label.linkOffsetY = -30;
    return label;
}
