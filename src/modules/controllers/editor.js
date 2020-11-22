import { initCameraController } from "../controllers/camera"
import { initModelController } from "../controllers/model";
import { initKeyboard } from "../UI/controllers/keyboard";
import { initMouseController } from "../UI/controllers/mouse";
import { initFileController } from "../controllers/file";
import { initScene } from "../controllers/scene";


export function initEditor(state) {
    initCameraController(state);
    initModelController(state);
    initKeyboard(state);
    initMouseController(state);    
    initFileController(state); // pass in state
    initScene(state);
    // we dont want UI elements 
    // access to application state
    
}