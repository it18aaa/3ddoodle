import { EVENTS } from "./constants";
import $ from "jquery";


export function button(id, text, container = "button-container") {
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);
}

export function button2(id, text, event, callback, container = "button-container") {
    // render the button
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);

    // attach the callback
    $(`#${id}`).on('click', callback);
}

export function getButton(id, text) {
    return `<button id='${id}'>${text}</button>`;
}

// TODO: remove hardcoded styles...
export function getTextField(id, label, def = "") {
    let output = `<div style='border: 1px solid grey'>`;
    output += `${label}: <br />`;
    output += `<input type='text' id='${id}'>${def}</input>`;
    output += `</div>`;
    return output;
}

export class Dialog {
    static count = 0;
    static fadeInTime = 400;
    title;
    id;
    hidden = true;  // all modals are hidden to begin with
    content;
    bus;
    buttonCancelId;
    buttonOkayId;

    constructor(id, title, eventBus) {
        this.bus = eventBus;
        this.id = id;
        this.buttonOkayId = `btn${id}-OKAY`;
        this.buttonCancelId = `btn${id}-CANCEL`
        this.title = title ? title : "blank dialog!";
        this.render();

        // init static variable if not defined
        if (Dialog.getVisibleCount() == undefined) {
            Dialog.setVisibleCount(0);
        }
    }

    // override this method to add content
    contents() {
        return; /// return the insides of the dialog box
    }

    // override this method to wire up call backs, if needed
    callbacks() {
        return;
    }

    render() {
        var output;
        output = `<div class='modal' id='${this.id}'>`;
        output += `<div class='modal-title'>${this.title}</div>`;

        // render content here.... 
        output += `<div class='modal-content'>`;
        if (this.contents()) {
            output += this.contents();
        }
        output += `</div>`;

        output += `<div id='${this.id}-button-container'
        style='text-align: right'>`;
        output += getButton(`${this.buttonOkayId}`, 'Okay');
        output += getButton(`${this.buttonCancelId}`, 'Cancel');
        output += `</div>`;
        output += `</div>`;

        $('body').append(output);

        // call back for the ok button
        $(`#${this.buttonOkayId}`).on('click', () => {
            this.accept();
        })

        // call back for the cancel button
        $(`#${this.buttonCancelId}`).on('click', () => {
            this.cancel();
        })

        // wire up any other call backs
        this.callbacks();
    }

    // static methods to martial dialog modality

    static getVisibleCount() {
        return Dialog.count;
    }

    static setVisibleCount(num) {
        if (Number.isInteger(num)) {
            Dialog.count = num;
        }
    }

    show() {
        // if there are no dialogs open already
        // and this dialog is hidden
        if (Dialog.getVisibleCount() == 0 && this.hidden == true) {
            $(`#${this.id}`).fadeIn(Dialog.fadeInTime);
            Dialog.setVisibleCount(Dialog.getVisibleCount() + 1);
            this.hidden = false;
        } else {
            // DEBUG
            // console.log("dialog already open!", Dialog.getVisibleCount())
        }
    }

    hide() {
        // if this dialog is not hidden, then hide it
        if (this.hidden == false) {
            $(`#${this.id}`).fadeOut(Dialog.fadeInTime);
            Dialog.setVisibleCount(Dialog.getVisibleCount() - 1);
            this.hidden = true;
        }
    }

    // override this to perform a different action
    accept() {
        
        // hide the form
        this.bus.dispatch(EVENTS.GUI_DIALOG_ACCEPT,
            {
                type: "FORMDATA",
                height: 1.4,
            });
        this.resetForm();
        this.hide();
    }

    cancel() {
        // wire up the cancel call back
        // clear the form and hide it
        this.bus.dispatch(EVENTS.GUI_DIALOG_ACCEPT,
            {
                particulars:
                    "form data"
            });
        this.resetForm();
        this.hide();
    }
    resetForm() {
        // method to override
        // fill out form fields

    }
}

export class CameraOptionsDialog extends Dialog {
    
    oid = '';
    pid =  '';
    constructor(id, title, eventBus) {             
        super(id, title, eventBus);    
        
        // // this doesn't work in here, needs to be called from elsewhere
        // this.oid = `btn${this.id}ortho`;
        // this.pid = `btn${this.id}persp`;      

    }    

    contents() {
        var content;
        // this.boo();
        this.oid = `btn${this.id}ortho`;
        this.pid = `btn${this.id}persp`;

        // console.log("contents this", this)
        content += `Change View type<br />`;
        content += getButton(this.pid, 'Perspective View');
        content += getButton(this.oid, 'Orthographic View');
                        
        return content;
    }

    callbacks() {
        $(`#${this.oid}`).on('click', ()=> {            
            this.bus.dispatch(EVENTS.GUI_CAMERA_ORTHO)
        })

        $(`#${this.pid}`).on('click', ()=> {                        
            this.bus.dispatch(EVENTS.GUI_CAMERA_PERSPECTIVE)
        })
    }
}

// TODO: this isn't very good, needs refactoring
export function rangeSlider(
    id,
    text,
    min = 0,
    max = 10,
    step = 1,
    container = "button-container",
    value = 5
) {
    $(`.${container}`).append(
        `<input id='${id}' type='range' min=${min} max=${max} step=${step}>${text}</input>`
    );
}


