import {
    EVENTS
} from "./types";

export class EventBus {
    #lastSubscriberID = 0; // likewise increment for
    #events = []; // buffer for events?
    #subscribers = {};

    subscribe(type, callback) {
        let id = this.#lastSubscriberID + 1;

        if (!this.#subscribers[type]) {
            this.#subscribers[type] = {};
        }

        this.#subscribers[type][id] = callback;
        this.#lastSubscriberID = id;

        return id;
    }

    unsubscribe(id) {
        // look through the array for the callback id
        // then remove it
        // not yet implemented as not sure required?
    }

    list() {
        Object.values(EVENTS).forEach(event => {
            console.log(event)
            if (this.#subscribers[event]) {
                Object.keys(this.#subscribers[event]).forEach((id) =>
                    console.log(`${this.#subscribers[event][id]}`)
                );
            }
        })
    }

    clear() {}


    dispatch(type, payload) {
        // check the event type first, otherwise complain and do nothing
        if (EVENTS.hasOwnProperty(type)) {
            // is this event subscribed too?
            if (!this.#subscribers[type]) {
                return;
            }

            // console.log(`Event: `, type, payload);

            Object.keys(this.#subscribers[type]).forEach((id) =>
                this.#subscribers[type][id](payload)
            );
        } else {
            throw `Unknown event ${type}`;
        }
    }
}