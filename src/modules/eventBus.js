export const EVENTS = Object.freeze({
    GUI_CLICK_MODE_DRAG: Symbol("GUI_CLICK_MODE_DRAG"),
    GUI_CLICK_MODE_DRAW: Symbol("GUI_CLICK_MODE_DRAW"),
    GUI_CLICK_MODE_CREATE: Symbol("GUI_CLICK_MODE_CREATE"),
    GUI_CLICK_SELECTED_UP: Symbol("GUI_CLICK_SELECTED_UP"),
    GUI_CLICK_SELECTED_DOWN: Symbol("GUI_CLICK_SELECTED_DOWN"),
    MOUSE_MESH_SELECTED: Symbol("MOUSE_MESH_SELECTED"),
    MOUSE_MESH_UNSELECTED: Symbol("MOUSE_MESH_UNSELECTED"),
    MOUSE_MESH_DRAG_END: Symbol("MOUSE_MESH_DRAG_END"),
    GUI_CAMERA_FREEZE_TOGGLE: Symbol("GUI_CAMERA_FREEZE_TOGGLE"),
    CAMERA_FROZEN: Symbol("CAMERA_FROZEN"),
    CAMERA_UNFROZEN: Symbol("CAMERA_UNFROZEN"),
    GUI_POLYGON: Symbol("GUI_POLYGON"), 
    GUI_CLEAR: Symbol("GUI_CLEAR"),
    GUI_LENGTH_BUTTON: Symbol("GUI_LENGTH_BUTTON")
});

export class EventBus {
    #lastSubscriberID = 0; // likewise increment for     
    #events = [];  // buffer for events?
    #subscribers = {}

    subscribe(type, callback) {
        let id = this.#lastSubscriberID + 1;
        
        if(! this.#subscribers[type]) {
            this.#subscribers[type] = {};
        }

        this.#subscribers[type][id] = callback;

        console.log("registered new callback for ", type, id);
        this.#lastSubscriberID = id;

        return id;
    }

    unsubscribe(id) {
        // look through the array for the callback id
        // then remove it        
    }

    dispatch(type, payload) {
        // is this event subscribed too?
        // if not 
        if (!this.#subscribers[type]) {
            return;
        } 
             Object.keys(this.#subscribers[type])
                 .forEach(id => this.#subscribers[type][id](payload));

        }
    }