import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { EVENTS } from "../../event/types";

export function initMouseController(state) {
    
    // listen for mouse right click, but if
    // only we're in string line mode ....
    state.handlerContextMenu = function() {
        const scene = state.scene;
        
        if (!state.scene.activeCamera.inputs.attachedElement) {
            const picked = scene.pick(scene.pointerX, scene.pointerY);
            if (
                picked.pickedMesh &&
                picked.pickedMesh.name.substring(0, 4) == "post"
            ) {
                state.outline.delFencePostByName(picked.pickedMesh.name);
            } else {
                state.outline.addFencePost(picked.pickedPoint);
            }
        }
    }
    state.canvas.addEventListener("contextmenu", state.handlerContextMenu);
    
    // TODO: Tidy this function, its too big
    // picking items in the scene
    state.scene
        .onPointerObservable
        .add(evt => {
                // if there are no inputs attached to the camera,
                // we're not in a view mode...
                if (!state.scene.activeCamera.inputs.attachedElement) {

                    // if we've clicked on a mesh, that isn't the ground, sky, string or post 
                    // left mouse button then..
                    if (
                        evt.pickInfo.hit &&
                        evt.pickInfo.pickedMesh &&
                        evt.event.button === 0 &&
                        evt.pickInfo.pickedMesh.name !== "ground1" &&
                        evt.pickInfo.pickedMesh.name !== "stringLine" &&
                        evt.pickInfo.pickedMesh.name !== "skyBox" &&
                        evt.pickInfo.pickedMesh.name.substring(0, 4) !== "post"
                    ) {
                        // if nothing is selected, then select the mesh
                        if (!state.selected) {
                            state.bus.dispatch(EVENTS.MODEL_SELECT, {
                                id: evt.pickInfo.pickedMesh.uniqueId
                            });
                            // otherwise if something is selected, butthats not
                            // was clikced, unselect it, and select what was picked
                        } else if (state.selected && evt.pickInfo.pickedMesh.uniqueId != state.selected) {
                            state.bus.dispatch(EVENTS.MODEL_UNSELECT, {
                                id: state.selected
                            })
                            state.bus.dispatch(EVENTS.MODEL_SELECT, {
                                id: evt.pickInfo.pickedMesh.uniqueId
                            });
                        }
                    // unselect stuff if we've clicked somewhere unselectable
                    } else if (state.selected) {
                        state.bus.dispatch(EVENTS.MODEL_UNSELECT, {
                            id: state.selected
                        });
                    }
                }
            },
            PointerEventTypes.POINTERPICK
        );
}