"use strict";
import {
    EVENTS
} from "../event/types";
import {
    button,
    button2,
    checkBox,
    rangeSlider,
    slider2
} from "./components";
import $ from "jquery";
import { 
    Dialog
} from "./dialogs/dialog";
import {
    CameraOptionsDialog
} from "./dialogs/cameraOptionsDialog";
import {
    LengthsDialog
} from "./dialogs/lengthsDialog";
import {
    InsertItemDialog
} from "./dialogs/insertItemDialog"
import {
    CreateGroundDialog
} from "./dialogs/createGroundDialog"
import {
    CreateFenceDialog
} from "./dialogs/createFenceDialog";
import { ConfirmDeleteDialog } from "./dialogs/confirmDeleteDialog";
import { OpenDialog } from "./dialogs/openDialog";
import { SaveDialog } from "./dialogs/saveDialog";
import { ConfirmClearDialog } from "./dialogs/confirmClearDialog";
import { LocationDialog } from "./dialogs/locationDialog";
import { timeSlider } from "./components";
import { dateSlider } from "./components";

// Initialise the user interface - draw all the buttons and dialogs
export function initUI(bus) {

    // DIALOG BOXES :-

    // namespace our dialogs
    const dialogs = {};

    dialogs.location = new LocationDialog("dlgLocation", "Location", bus);
    dialogs.location.render();

    dialogs.clear = new ConfirmClearDialog("dlgClear", "Clear design", bus);
    dialogs.clear.render();

    dialogs.open = new OpenDialog("dlgOpen", "Open Design", bus);
    dialogs.open.render();

    dialogs.save = new SaveDialog("dlgSave", "Save design", bus);
    dialogs.save.render();

    dialogs.create = new CreateGroundDialog("dlgCreate", "Create ground item!", bus);
    dialogs.create.render();

    dialogs.cameraOptions = new CameraOptionsDialog(
        "dlgCamera",
        "Camera options",
        bus
    );
    dialogs.cameraOptions.render();

    dialogs.confirmDelete = new ConfirmDeleteDialog("dlgConfirmDelete", "Confirm delete", bus );
    dialogs.confirmDelete.render();

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

    $("body").append('<div class="button-container"></div>');
    $("body").append('<div class="sun-control-container"></div>');

    // legacy buttons -
    button("btnDebug", "debug");   
    // button("btnClear", "Clear");

    button2("btnClear", "Clear", bus, ()=> {
        bus.dispatch(EVENTS.CLEAR_REQUEST);
    })

    // as keep the function call to one place
    bus.subscribe(EVENTS.CLEAR_REQUEST, ()=> {
        dialogs.clear.show();
    });

    button2("btnOpen", "Open", bus, ()=>{
        dialogs.open.update(null);
        dialogs.open.show();
    });

    button2("btnSave", "Save", bus, ()=> {
        dialogs.save.update(null);
        dialogs.save.show();
    } )

    button2("btnClearStringline", "Clear Line", bus, ()=> {
        bus.dispatch(EVENTS.GUI_CLEAR_STRINGLINE);
    })

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

    bus.subscribe(EVENTS.DELETE_CONFIRM, (item) => {        
        dialogs.confirmDelete.update(item);
        dialogs.confirmDelete.show();
    })

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

    button2("btnFence", "Fences", bus, () => {
        dialogs.fence.update();
        dialogs.fence.show();
    })

  

    timeSlider("rngTime", "Time", (time)=>{
        bus.dispatch(EVENTS.TIME_SET, time);
    }, "sun-control-container");

    dateSlider("rngDate", "Date", (date)=>{
        bus.dispatch(EVENTS.DATE_SET, date);
    }, "sun-control-container");

    button2("btnLocationDialog", "Location", bus, ()=>{
        dialogs.location.show();

    }, "sun-control-container");
    checkBox("chkShadows", "Shadows", (shadows)=> {
        if(shadows) {
            bus.dispatch(EVENTS.SHADOWS_ON);
        } else {
            bus.dispatch(EVENTS.SHADOWS_OFF);
        }
    }, "sun-control-container");


    // Manage the Camera Options Dialog
    // Open the dialog, update the
    button2("btnCameraOptions", "Camera Options", bus, () => {
            dialogs.cameraOptions.show();
        },
        "button-container"
    );

    $("#btnDebug").on("click", () => {
        bus.dispatch(EVENTS.GUI_DEBUG);
    });
}