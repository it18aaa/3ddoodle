import { EVENTS } from "../../constants";
import $ from "jquery";
import { getButton, getTextField } from "../../guiComponents"

export class Dialog {
    static count;
    static fadeInTime;
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
        this.hidden = true;
        // this.render();  // this is an anti-pattern, needs to be moved out

        // init static variable if not defined
        if (Dialog.getVisibleCount() == undefined) {
            Dialog.setVisibleCount(0);
        }

        if(Dialog.fadeInTime == undefined) {
            Dialog.fadeInTime = 400;
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
            // output += 'parent:'
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
