import {
    EVENTS
} from '../../event/types';
import {
    KeyboardEventTypes
} from "@babylonjs/core/Events/keyboardEvents";


export function initKeyboard(state) {

    // keyboard behaviour
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
            }
        }      
    });
}