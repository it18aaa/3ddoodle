"use strict";
import { EVENTS } from "../event/types";
import { button, button2, rangeSlider } from "./components";
import $ from "jquery";
import { Dialog } from "./dialogs/dialog";
import { CameraOptionsDialog } from "./dialogs/cameraOptionsDialog";
import { LengthsDialog } from "./dialogs/lengthsDialog";

// this should be an init thing, to set up buttons on tool bars etc..
export function initUI(bus) {
  // namespace our dialogs
  const dialogs = {};

  dialogs.create = new Dialog("dlgCreate", "Create an item", bus);
  dialogs.create.render();

  dialogs.cameraOptions = new CameraOptionsDialog(
    "dlgCamera",
    "Camera options",
    bus
  );
  dialogs.cameraOptions.render();

  dialogs.other = new Dialog("dlgCamera", "Other", bus);
  dialogs.other.render();

  dialogs.lengths = new LengthsDialog("dlgLengths", "Measurements", bus);
  dialogs.lengths.render();

  // Object.entries(dialogs).forEach(obj=>{ obj.render() });

  $(".button-container").remove();

  $("body").append('<div class="button-container">Garden Designer! </div>');

  // legacy buttons -
  button("btnDebug", "debug");
  button("btnPolygon", "Polygon");
  button("btnClear", "Clear");

  // measure lengths buttons
  button2("btnLength", "Measurements", bus, () => {
    bus.dispatch(EVENTS.GUI_LENGTH_BUTTON);
  });

  // listen for the lengths information and update the dialog
  bus.subscribe(EVENTS.GUI_LENGTHS_INFO, (payload) => {
    console.log("Lengths payload", payload);
    // update the lengths dialog with payload...
    dialogs.lengths.update(payload);
    dialogs.lengths.show();
  });

  // when the posts are moved the lengths will change
  bus.subscribe(EVENTS.STRINGLINE_LENGTHS_UPDATED, (data) => {
    if (data.lengths.length > 0) {
      dialogs.lengths.update(data);
    }
  });

  button2("btnModeEdit", "Edit", bus, () => {
    bus.dispatch(EVENTS.MODE_EDIT);
    $("#btnModeEdit").addClass("button-active");
    $("#btnModeCamera").removeClass("button-active");
    $("#iconeye").fadeOut(200);
    $("#iconstring").fadeIn(200);
  });

  button2("btnModeCamera", "View", bus, () => {
    bus.dispatch(EVENTS.MODE_CAMERA);
    $("#btnModeEdit").removeClass("button-active");
    $("#btnModeCamera").addClass("button-active");
    $("#iconstring").fadeOut(200);
    $("#iconeye").fadeIn(200);
  });

  button2(
    "btnCreate",
    "Create",
    bus,
    () => {
      dialogs.create.show();
    },
    "button-container"
  );

  button2("btnGravel1", "Gravel1", bus, () => {
    bus.dispatch(EVENTS.CREATE_GRAVEL);
  });

  // Manage the Camera Options Dialog

  // Open the dialog, update the
  button2(
    "btnCameraOptions",
    "Camera Options",
    bus,
    () => {
      dialogs.cameraOptions.show();
    },
    "button-container"
  );

  button2("btnGrass", "Grass", bus, () => {
    bus.dispatch(EVENTS.CREATE_GRASS);
  });

  button2("btnBorder", "Border", bus, () => {
    bus.dispatch(EVENTS.CREATE_BORDER);
  });

  button2("btnPatio", "Patio", bus, () => {
    bus.dispatch(EVENTS.CREATE_PATIO);
  });

  
  button2("btnLightFence", "Light Fence", bus, () => {
    bus.dispatch(EVENTS.GUI_LIGHT_FENCE, {
      height: $("#rngHeight").val(),
    });
  });

  button2("btnBlueFence", "Woodpallaside", bus, () => {
    bus.dispatch(EVENTS.GUI_BLUE_FENCE, {
      height: $("#rngHeight").val(),
    });
  });
  
  rangeSlider("rngHeight", "height", 0, 4, 0.1);
  $("#rngHeight").on("change", function () {
    this.text = "freddo ";
  });

  $("#btnBounding").on("click", () => {
    bus.dispatch(EVENTS.GUI_BOUNDING);
  });

  $("#btnPolygon").on("click", () => {
    bus.dispatch(EVENTS.GUI_POLYGON);
  });

  $("#btnClear").on("click", () => {
    bus.dispatch(EVENTS.GUI_CLEAR);
  });

  $("#btnKeep").on("click", () => {
    bus.dispatch(EVENTS.GUI_KEEP);
  });

  $("#btnDebug").on("click", () => {
    bus.dispatch(EVENTS.GUI_DEBUG);
  });
}
