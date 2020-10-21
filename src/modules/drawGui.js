'use strict';
import {
    EVENTS
} from './constants';
import {
    button,
    button2,
    rangeSlider
} from './guiComponents';
import $ from 'jquery';
import {
    Dialog
} from './dialog';
import {
    CameraOptionsDialog
} from './cameraOptionsDialog';
import {
    LengthsDialog
} from './lengthsDialog';

export function drawGui(bus) {

    // namespace our dialogs
    const dialogs = {};

    dialogs.create = new Dialog('dlgCreate', 'Create an item', bus);
    dialogs.create.render();

    dialogs.cameraOptions = new CameraOptionsDialog('dlgCamera', 'Camera options', bus);
    dialogs.cameraOptions.render();

    dialogs.other = new Dialog('dlgCamera', 'Other', bus);
    dialogs.other.render();

    dialogs.lengths = new LengthsDialog('dlgLengths', 'Measurements', bus);
    dialogs.lengths.render();

    // Object.entries(dialogs).forEach(obj=>{ obj.render() });

    $(".button-container").remove();

    $("body").append('<div class="button-container">Garden Designer! </div>');

    // legacy buttons -
    button("btnDebug", "debug")
    button("btnPolygon", "Polygon");
    button("btnClear", "Clear");

    // measure lengths buttons
    button2("btnLength", "Measurements", bus, () => {
        bus.dispatch(EVENTS.GUI_LENGTH_BUTTON);
    })

    // listen for the lengths information and update the dialog
    bus.subscribe(EVENTS.GUI_LENGTHS_INFO, payload => {
        console.log("Lengths payload", payload)
        // update the lengths dialog with payload...
        dialogs.lengths.update(payload);
        dialogs.lengths.show();
    })

    // when the posts are moved the lengths will change
    bus.subscribe(EVENTS.STRINGLINE_LENGTHS_UPDATED, data => {
        if (data.lengths.length > 0) {
            dialogs.lengths.update(data);
        }
    })

    button2("btnModeEdit", "Edit Mode", bus, () => {
        bus.dispatch(EVENTS.MODE_EDIT);
        $('#btnModeEdit').addClass('button-active');
        $('#btnModeCamera').removeClass('button-active');
        $('#iconeye').fadeOut(200);
        $('#iconstring').fadeIn(200);
    });

    button2("btnModeCamera", "Camera Mode", bus, () => {
        bus.dispatch(EVENTS.MODE_CAMERA);
        $('#btnModeEdit').removeClass('button-active');
        $('#btnModeCamera').addClass('button-active');
        $('#iconstring').fadeOut(200);
        $('#iconeye').fadeIn(200);
    });

    button2("btnCreate", "Create", bus, () => {
        dialogs.create.show();
    }, "button-container");

    button2("btnCameraOptions", "Camera Options", bus, () => {
        dialogs.cameraOptions.show();
    }, "button-container");


    button2("btnGrass", "Grass", bus, () => {
        bus.dispatch(EVENTS.CREATE_GRASS);
    })

    button2("btnBorder", "Border", bus, () => {
        bus.dispatch(EVENTS.CREATE_BORDER);
    })

    button2("btnPatio", "Patio", bus, () => {
        bus.dispatch(EVENTS.CREATE_PATIO);
    })

    button2("btnWhiteFence", "White Fence", bus, () => {
        bus.dispatch(EVENTS.GUI_WHITE_FENCE, {
            height: $("#rngHeight").val()
        });
    })

    button2("btnLightFence", "Light Fence", bus, () => {
        bus.dispatch(EVENTS.GUI_LIGHT_FENCE, {
            height: $("#rngHeight").val()
        });
    })

    button2("btnBlueFence", "Blue Fence", bus, () => {
        bus.dispatch(EVENTS.GUI_BLUE_FENCE, {
            height: $("#rngHeight").val()
        });
    })

    button2("btnTexFence", "Texture Fence", bus, () => {
        bus.dispatch(EVENTS.GUI_TEXTURE_FENCE, {
            height: $("#rngHeight").val()
        });
    })


    rangeSlider("rngHeight", "height", 0, 4, .1);
    $("#rngHeight").on('change', function (ev) {
        this.text = "freddo "
    })


    button("btnFence", "Fence");
    $("#btnFence").on('click', ev => {
        var height = $("#rngHeight").val();
        bus.dispatch(EVENTS.GUI_FENCE, {
            height: height
        });
    })


    $("#btnBounding").on('click', (event) => {
        bus.dispatch(EVENTS.GUI_BOUNDING);
    })

    // // freeze camera button
    // $("#btnFreezeCamera").on('click', (event) => {
    //     eventBus.dispatch(EVENTS.GUI_CAMERA_FREEZE_TOGGLE);
    // });

    $("#btnPolygon").on('click', (event) => {
        bus.dispatch(EVENTS.GUI_POLYGON);
    });



    $("#btnClear").on('click', (event) => {
        bus.dispatch(EVENTS.GUI_CLEAR);
    });

    // $("#btnLength").on('click', (event) => {
    //     bus.dispatch(EVENTS.GUI_LENGTH_BUTTON)
    // });

    $("#btnKeep").on('click', (event) => {
        bus.dispatch(EVENTS.GUI_KEEP);
    });

    $("#btnDebug").on('click', ev => {
        bus.dispatch(EVENTS.GUI_DEBUG)
    })


}