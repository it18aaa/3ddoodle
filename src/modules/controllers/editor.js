import { initCameraController } from "../controllers/camera"
import { initModelController } from "../controllers/model";
import { initKeyboard } from "../UI/controllers/keyboard";
import { initMouseController } from "../UI/controllers/mouse";
import { initFileController } from "../controllers/file";
import { initSunController } from "../controllers/sun";
import { initScene } from "../controllers/scene";
import { initGrowthController } from "./growth";
import { EVENTS } from "../event/types";

export function initEditor(state) {
    state.scene.metadata = {};
    initCameraController(state);
    initModelController(state);
    initKeyboard(state);
    initMouseController(state);
    initFileController(state); // pass in state
    initSunController(state);
    initGrowthController(state);
    initScene(state);

    // GET LENGTHS
    state.bus.subscribe(EVENTS.GUI_LENGTH_BUTTON, () => {
        state.bus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
            lengths: state.outline.getLengths(),
            total: state.outline.totalLength,
        });
    });

    // CLEAR BUTTON - resents the stringline
    state.bus.subscribe(EVENTS.GUI_CLEAR_STRINGLINE, () => {
        state.outline.reset();
        state.bus.dispatch(EVENTS.GUI_LENGTHS_INFO, {
            lengths: state.outline.getLengths(),
            total: state.outline.totalLength,
        });
    });

    // debug if enabled
    state.bus.subscribe(EVENTS.GUI_DEBUG, () => {
        if (state.scene.debugLayer.isVisible()) {
            state.scene.debugLayer.hide();
        } else {
            state.scene.debugLayer.show();
        }
    });
}