import {
    PointerEventTypes
} from "@babylonjs/core/Events/pointerEvents";
import {
    EVENTS
} from "../../event/types";


export function initMouseController(state, bus) {

    let selected = null;


    bus.subscribe(EVENTS.DELETE_DO, item => {
        // if its being deleted, its not longer selected
        selected = null;
    });

    bus.subscribe(EVENTS.MODEL_UNSELECT, item=> {
        selected = null;
    });

    // to see if controls are attached ... 
    // camera.inputs.attachedElement

    state.scene.onPointerObservable.add(evt => {
            // if there are no inputs attached to the camera,
            // we're not in a view mode...
            if (!state.scene.activeCamera.inputs.attachedElement) {

                // if we've clicked on a mesh, that isn't the ground, with
                // left mouse button...
                if (
                    evt.pickInfo.hit &&
                    evt.pickInfo.pickedMesh &&
                    evt.event.button === 0 &&
                    evt.pickInfo.pickedMesh.name !== "ground1" && 
                    evt.pickInfo.pickedMesh.name !== "stringLine" &&  
                    evt.pickInfo.pickedMesh.name.substring(0,4) !== "post"
                ) {

                    // if nothing is selected, then select the mesh
                    if (!selected) {
                        selected = evt.pickInfo.pickedMesh.uniqueId;
                        bus.dispatch(EVENTS.MODEL_SELECT, {
                            id: selected
                        });

                    } else if (selected && evt.pickInfo.pickedMesh.uniqueId != selected) {
                        bus.dispatch(EVENTS.MODEL_UNSELECT, {
                            id: selected
                        })

                        selected = evt.pickInfo.pickedMesh.uniqueId;
                        bus.dispatch(EVENTS.MODEL_SELECT, {
                            id: selected
                        });
                    }
                } else if (selected) {
                    bus.dispatch(EVENTS.MODEL_UNSELECT, {
                        id: selected
                    });
                    selected = null;
                }
            }
        },
        PointerEventTypes.POINTERPICK
    );


}