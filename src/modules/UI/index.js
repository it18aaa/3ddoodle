"use strict";
import {
    EVENTS
} from "../event/types";
import {
    button,
    button2,
    rangeSlider
} from "./components";
import $ from "jquery";
import { Dialog } from "./dialogs/dialog";
import { CameraOptionsDialog } from "./dialogs/cameraOptionsDialog";
import { LengthsDialog } from "./dialogs/lengthsDialog";
import { InsertItemDialog } from "./dialogs/insertItemDialog"
import { CreateGroundDialog } from "./dialogs/createGroundDialog"
import { CreateFenceDialog } from "./dialogs/createFenceDialog";


// Initialise the user interface - draw all the buttons and dialogs
export function initUI(bus) {

    // DIALOG BOXES :-

    // namespace our dialogs
    const dialogs = {};


    dialogs.create = new CreateGroundDialog("dlgCreate", "Create ground item!", bus);
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

    dialogs.insert = new InsertItemDialog("dlgInsert", "Insert garden items", bus);
    dialogs.insert.render();

    dialogs.fence = new CreateFenceDialog("dlgFence", "Fence or Boundary", bus);
    dialogs.fence.render();

    // Object.entries(dialogs).forEach(obj=>{ obj.render() });

    $(".button-container").remove();

    $("body").append('<div class="button-container">Garden Designer! </div>');

    // legacy buttons -
    button("btnDebug", "debug");
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
    });

    button2("btnModeCamera", "View", bus, () => {
        bus.dispatch(EVENTS.MODE_CAMERA);        
    });

    // change the gui to reflect mode changes
    bus.subscribe(EVENTS.MODE_EDIT, () => {
        $("#btnModeEdit").addClass("button-active");
        $("#btnModeCamera").removeClass("button-active");
        $("#iconeye").fadeOut(200);
        $("#iconstring").fadeIn(200);
    });

    // change the gui to reflect camera mode!
    bus.subscribe(EVENTS.MODE_CAMERA, () => {
        $("#btnModeEdit").removeClass("button-active");
        $("#btnModeCamera").addClass("button-active");
        $("#iconstring").fadeOut(200);
        $("#iconeye").fadeIn(200);
    });

    


    button2("btnCreate", "Ground", bus, () => {
            dialogs.create.update();
            dialogs.create.show();
        },
        // "button-container"
    );

    button2("btnInsert", "Items & Plants", bus, () => {
        dialogs.insert.update();
        dialogs.insert.show();
    })

    button2("btnFence", "Fences", bus, ()=> {
        dialogs.fence.update();
        dialogs.fence.show();
    })

    // Manage the Camera Options Dialog
    // Open the dialog, update the
    button2("btnCameraOptions", "Camera Options", bus, () => {
            dialogs.cameraOptions.show();
        },
        "button-container"
    );


    // button2("btnLightFence", "Light Fence", bus, () => {
    //     bus.dispatch(EVENTS.GUI_LIGHT_FENCE, {
    //         height: $("#rngHeight").val(),
    //     });
    // });

    // button2("btnBlueFence", "Woodpallaside", bus, () => {
    //     bus.dispatch(EVENTS.GUI_BLUE_FENCE, {
    //         height: $("#rngHeight").val(),
    //     });
    // });

    // rangeSlider("rngHeight", "height", 0, 4, 0.1);
    // $("#rngHeight").on("change", function () {
    //     this.text = "freddo ";
    // });


    $("#btnClear").on("click", () => {
        bus.dispatch(EVENTS.GUI_CLEAR);
    });


    $("#btnDebug").on("click", () => {
        bus.dispatch(EVENTS.GUI_DEBUG);
    });
}