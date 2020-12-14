import { Dialog } from "./dialog";
// import { EVENTS } from "../../event/types";
// import { getButton } from "../components";
import $ from "jquery";

export class LengthsDialog extends Dialog {
  constructor(id, title, eventBus) {
    super(id, title, eventBus);
    // class fields don't work ...

    this.styleClass = this.styleClass + " measurements-dialog";
    this.toolWindow = true;
  }

  update(data) {
    // requires validation
    this.data = data;

    // alter the information on the rendered dialog...
    // using the placeholders...

    // change the total
    $(`#${this.id}total`).text(`${this.data.total.toFixed(2)}m`);

    let content = `<table class='lengths'>`;

    for (let i = 0; i < this.data.lengths.length; i++) {
      let l = this.data.lengths[i];
      content += `<tr><td>${i + 1}-${i + 2}</td><td> ${l.toFixed(
        2
      )} m</td></tr>`;
    }
    content += "</table>";
    $(`#${this.id}lengths`).html(content);
  }

  // override the parent contents() method
  contents() {
    let content = "";

    // we render placeholders here and update them with the update method
    // content += `Lengths<br />`;
    content += `Total length: <span id='${this.id}total'></span><br /><br />`;
    content += `Lengths: <br /><div class='scrollable' id='${this.id}lengths'></div>`;

    return content;
  }
}
