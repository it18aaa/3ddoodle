import {
    Dialog
} from "./dialog";
import $ from "jquery";
import { EVENTS } from "../../event/types";


export class ConfirmClearDialog extends Dialog {

    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
    }

    update(data) {
        this.data = data;
        $(`#${this.id}name`).text(`${this.data.name}`);
    }

    contents() {
        return `This will clear the current design.  Continue?`;
    }

    accept() {
        this.bus.dispatch(EVENTS.CLEAR_DO, this.data)
        super.accept();
    }

}