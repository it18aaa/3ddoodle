import { Dialog } from "./dialog";
import { EVENTS } from "../../constants";
import $ from "jquery";
import { Camera } from "@babylonjs/core/Cameras/camera";

export class CameraOptionsDialog extends Dialog {
  constructor(id, title, eventBus) {
    super(id, title, eventBus);

    // class fields can't be initialised in here properly
    eventBus.subscribe(EVENTS.CAMERA_INFO, (data) => {
      this.update(data);
    });
  }

  calcDistanceFromOrthoRight(value) {
    return value * 3;
  }

  contents() {
    let content = "";
    
    this.oid = `btn${this.id}ortho`;
    this.pid = `btn${this.id}persp`;

    content += `
        <h3>Camera Type</h3>
        <input type='radio' id='${this.oid}' name='Camera Type' value='Orthographic'>
        <label for='${this.oid}'>Orthographic</input>
        <input type='radio' id='${this.pid}' name='Camera Type' value='Perspective'>
        <label for='${this.pid}'>Perspective</input>
        <br />
        <div id='${this.pid}opt'>
            Field of View <span id='${this.id}fovInfo'></span> <br />     
            Angle: <span id='${this.pid}val'></span> Degrees <br />    
            <input id='${this.pid}rng' type='range' min=0.05 max=1.6 step=0.01 value=50>
            </input>       
        </div>

        <div id='${this.oid}opt'>
            Distance: <span id='${this.id}distanceInfo'></span> <br />   
            Distance: <span id='${this.oid}val'></span> <br />
            <input id='${this.oid}rng' type='range' min=10 max=200 value=50>
            </input>       
        </div>

        `;
    return content;
  }

  update(val) {
    this.data = val;
    console.log("updating dialog");
    if (this.data.mode == Camera.ORTHOGRAPHIC_CAMERA) {
      this.updateOrtho();
    } else {
      this.updatePersp();
    }

    console.log("cmaera options ", this.data);
  }

  updatePersp() {
    $(`#${this.oid}`).prop("checked", false);
    $(`#${this.oid}opt`).hide();

    $(`#${this.pid}`).prop("checked", true);
    $(`#${this.pid}opt`).show();
    $(`#${this.pid}rng`).prop("value", this.data.fov);
    const num = (this.data.fov * 180) / Math.PI;
    $(`#${this.pid}val`).text(num.toFixed().toString());
  }

  updateOrtho() {
    $(`#${this.pid}`).prop("checked", false);
    $(`#${this.pid}opt`).hide();

    $(`#${this.oid}`).prop("checked", true);
    $(`#${this.oid}opt`).show();

    $(`#${this.oid}rng`).prop("value", this.data.distance);
    $(`#${this.oid}val`).text(`${this.data.distance}`);
  }

  show() {
    // update the camera details
    this.bus.dispatch(EVENTS.GUI_CAMERA_OPTIONS);
    super.show();
  }

  callbacks() {
    // orther radio button
    // on check box change change the checkbox
    $(`#${this.oid}`).on("click", () => {
      this.bus.dispatch(EVENTS.GUI_CAMERA_ORTHO);
      $(`#${this.oid}opt`).show();
      $(`#${this.pid}opt`).hide();
    });

    // ortho range slider
    // range slider, dispatch mode method
    // $(`#${this.oid}rng`).on('change', evt => {
    $(document).on("input", `#${this.oid}rng`, (evt) => {
      this.bus.dispatch(EVENTS.GUI_CAMERA_ORTHO, {
        distance: evt.target.value,
      });
      $(`#${this.oid}val`).text(evt.target.value);
    });

    // perspective range slider
    // range slider, dispatch mode method
    // $(`#${this.pid}rng`).on('change', evt => {
    $(document).on("input", `#${this.pid}rng`, (evt) => {
      this.bus.dispatch(EVENTS.GUI_CAMERA_PERSPECTIVE, {
        fov: evt.target.value,
      });
      const num = (evt.target.value * 180) / Math.PI;
      $(`#${this.pid}val`).text(num.toFixed());
    });

    // perspective radio button
    $(`#${this.pid}`).on("click", () => {
      this.bus.dispatch(EVENTS.GUI_CAMERA_PERSPECTIVE);
      $(`#${this.oid}opt`).hide();
      $(`#${this.pid}opt`).show();
    });
  }
}
