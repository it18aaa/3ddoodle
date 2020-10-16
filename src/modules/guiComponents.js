import { EVENTS } from "./eventBus";
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

export function getTextField(id, label, def = "") {
    let output = `<div style='border: 1px solid grey'>`;
    output += `${label}: <br />`;
    output += `<input type='text' id='${id}'>${def}</input>`;
    output += `</div>`;
    return output;
}


export class Dialog {
    title;
    id;
    hidden = true;  // all modals are hidden to begin with
    bus;
    buttonCancelId;
    buttonOkayId;

    constructor(id, title, eventBus) {
        console.log("inside the constructor of dialog!")
        this.bus = eventBus;
        this.id = id;

        this.buttonOkayId = `btn${id}-OKAY`;
        this.buttonCancelId = `btn${id}-CANCEL`
        this.title = title ? title : "blank dialog!";

        this.render();
    }

    render() {
        var output;
        output = `<div class='modal' id='${this.id}'>`;
        output += `<h1>${this.title}</h1>`;
        output += `<div id='${this.id}-button-container'>`;
        output += getTextField(`${this.id}-height`, 'Height');
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
    }

    show() {
        $(`#${this.id}`).fadeIn(200);
    }

    hide() {
        $(`#${this.id}`).fadeOut(200);
    }

    accept() {
        // wire up the accept call back
        // send dialog accept onto event bus along with
        // form values as payload :-)
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

    }
}

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


