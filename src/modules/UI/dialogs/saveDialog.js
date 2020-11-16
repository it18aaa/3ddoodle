import {
    Dialog
} from "./dialog";
import $ from "jquery";
import { EVENTS } from "../../event/types";


export class SaveDialog extends Dialog {

    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
    }

    update(data) {
        this.data = data;
        // $(`#${this.id}name`).text(`${this.data.name}`);
    }

    contents() {
        let content = "";

        content += `
        Save your design.

        Name - <input id='${this.id}name' type='text' />
        `;

        return content;
    }

    accept() {
        let name = $(`#${this.id}name`).val();
        console.log(name)
        this.bus.dispatch(EVENTS.SCENE_SAVE, { name: name });
        super.accept();
    }

}