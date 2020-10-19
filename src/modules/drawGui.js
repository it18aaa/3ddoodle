'use strict';
import { EVENTS } from './constants';
import { Dialog, CameraOptionsDialog, button, button2, rangeSlider } from './guiComponents';
import $ from 'jquery';

export function drawGui(eventBus) {

    // namespace our dialogs
    var dialogs = {};
    dialogs.create = new Dialog('dlgCreate', 'Create an item', eventBus);
    dialogs.cameraOptions = new CameraOptionsDialog('dlgCamera', 'Camera options', eventBus);
    dialogs.other = new Dialog('dlgCamera', 'Other', eventBus);

    $(".button-container").remove();

    $("body").append('<div class="button-container">Garden Designer! </div>');

    let cam_default = "Camera Mode";

    button("btnDebug", "debug")
    button("btnFreezeCamera", cam_default);
    button("btnPolygon", "Polygon");
    button("btnClear", "Clear");
    button("btnLength", "Lengths");
    button("btnKeep", "Keep");
    button("btnBounding", "Bounding Box");
    button("btnTube", "Tube");
    
    button("btnCameraPerspective", "Perspective");
    button("btnCameraOrtho", "Orthographic");

    // create button with callback built in.
    button2("btnCreate", "Create", eventBus, () => {
        dialogs.create.show();        
    }, "button-container");

    // camera options button with callback 
    button2("btnCameraOptions", "Camera Options", eventBus, () => {
        dialogs.cameraOptions.show();        
    }, "button-container");

    

    rangeSlider("rngHeight", "height", 0, 4, .1);
    $("#rngHeight").on('change', function (ev) {
        this.text = "freddo "
    })


    button("btnFence", "Fence");
    $("#btnFence").on('click', ev => {
        var height = $("#rngHeight").val();
        eventBus.dispatch(EVENTS.GUI_FENCE, {
            height: height
        });
    })

    $("#btnCameraPerspective").on('click', event => {
        eventBus.dispatch(EVENTS.GUI_CAMERA_PERSPECTIVE);
    })

    $("#btnCameraOrtho").on('click', event => {
        eventBus.dispatch(EVENTS.GUI_CAMERA_ORTHO);
    })


    $("#btnTube").on('click', event => {
        eventBus.dispatch(EVENTS.GUI_TUBE);
    });

    $("#btnBounding").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_BOUNDING);
    })

    // freeze camera button
    $("#btnFreezeCamera").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_CAMERA_FREEZE_TOGGLE);
    });

    $("#btnPolygon").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_POLYGON);
    });

    $("#btnClear").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_CLEAR);
    });

    $("#btnLength").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_LENGTH_BUTTON)
    });

    $("#btnKeep").on('click', (event) => {
        eventBus.dispatch(EVENTS.GUI_KEEP);
    });

    $("#btnDebug").on('click', ev => {
        eventBus.dispatch(EVENTS.GUI_DEBUG)
    })

    // change icon when camera is frozen
    eventBus.subscribe(EVENTS.CAMERA_FROZEN, (payload) => {
        $("#btnFreezeCamera").text("Draw Mode");
        console.log("Draw Mode: Use the mouse to draw the outline of your garden")
    });

    eventBus.subscribe(EVENTS.CAMERA_UNFROZEN, (payload) => {
        $("#btnFreezeCamera").text(cam_default);
        console.log("Camera Mode: use the mouse to move the camera around the scene")
    });
}

