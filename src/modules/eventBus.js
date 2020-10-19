

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
        this.#lastSubscriberID = id;

        return id;
    }

    unsubscribe(id) {
        // look through the array for the callback id
        // then remove it        
        // is this required?
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