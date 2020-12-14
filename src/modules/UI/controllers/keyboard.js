import {
    EVENTS
} from '../../event/types';
import {
    KeyboardEventTypes
} from "@babylonjs/core/Events/keyboardEvents";


export function initKeyboard(state) {

    // keyboard behaviour
    // this should send out generic events that are handled in the controllers for
    // but it is tidier to see the functionality here in one place
    state.scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type === KeyboardEventTypes.KEYUP) {
            switch (kbInfo.event.key) {
                case "Delete":
                case "Backspace":
                    state.bus.dispatch(EVENTS.DELETE_REQUEST);
                    break
                case "m":
                case "M":
                    state.bus.dispatch(EVENTS.MODE_TOGGLE);
                    break;
                case "ArrowUp":
                    if(state.selected) {
                        state.bus.dispatch(EVENTS.GROUND_UP);
                    }                    
                    break;
                case "ArrowDown":
                    if(state.selected) {
                        state.bus.dispatch(EVENTS.GROUND_DOWN);
                    }                    
                    break;
                default:
                    // console.log("keyboard: ", kbInfo.event.key)
                    break;
            }
        }
    });
}