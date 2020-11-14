import {
    Dialog
} from "./dialog";
import $ from "jquery";
import { EVENTS } from "../../event/types";


export class ConfirmDeleteDialog extends Dialog {

    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
    }

    update(data) {
        this.data = data;
        $(`#${this.id}name`).text(`${this.data.name}`);
    }

    contents() {
        return `Do you wish to delete the selected item? <br />Name: <span id='${this.id}name'></span><br /><br />`;
    }

    accept() {
        this.bus.dispatch(EVENTS.DELETE_DO, this.data)
        super.accept();
    }

}