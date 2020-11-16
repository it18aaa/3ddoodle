import {
    Dialog
} from "./dialog";
import $ from "jquery";
import { EVENTS } from "../../event/types";


export class OpenDialog extends Dialog {

    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
    }

    update(data) {
        this.data = data;
        // $(`#${this.id}name`).text(`${this.data.name}`);
    }

    contents() {
        return `Open a design!`;
    }

    accept() {
        // this.bus.dispatch(EVENTS.DELETE_DO, this.data)
        super.accept();
    }

}