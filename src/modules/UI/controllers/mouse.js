import {
    PointerEventTypes
} from "@babylonjs/core/Events/pointerEvents";
import { EVENTS } from "../../event/types";


export function initMouseController(scene, bus) {
    
    let selected = null;

    scene.onPointerObservable.add(evt => {

            // if we've clicked on a mesh, that isn't the ground, with
            // left mouse button...
            if (
                evt.pickInfo.hit &&
                evt.pickInfo.pickedMesh &&
                evt.event.button === 0 &&
                evt.pickInfo.pickedMesh.name !== "ground1"
            ) {
                // if nothing is selected
                if (!selected) {
                    selected = evt.pickInfo.pickedMesh.name;
                    bus.dispatch(EVENTS.MODEL_SELECT, {
                        name: selected
                    });
                    // console.log("select: ", selected);
                } else if (selected && evt.pickInfo.pickedMesh.name != selected) {
                    bus.dispatch(EVENTS.MODEL_UNSELECT, {
                        name: selected
                    })
                    // console.log("unselect: ", selected);
                    selected = evt.pickInfo.pickedMesh.name;
                    bus.dispatch(EVENTS.MODEL_SELECT, {
                        name: selected
                    });
                    // console.log("select: ", selected);
                }
            } else if (selected) {
                bus.dispatch(EVENTS.MODEL_UNSELECT, {
                    name: selected
                });
                // console.log("unselect: ", selected);
                selected = null;
                // console.log("selected: ", selected);
            }
        },
        PointerEventTypes.POINTERDOWN
    );


}