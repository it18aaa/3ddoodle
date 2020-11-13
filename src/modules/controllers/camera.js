
import { EVENTS } from '../event/types'
import { animateCameraTo } from '../utility/animateCameraTo'
import { Camera } from "@babylonjs/core/Cameras/camera";

   // helper function to determine if the camera has
    // controls attached to it
    export function getCameraActive(camera) {
        return camera.inputs.attachedElement ? true : false;
    }


export function initCameraController(camera, canvas, eventBus, scene) {

    // attach camera to scene to start off with...
    camera.attachControl(canvas, false);

    //  CAMERA ORIENTATED EVENTS>...
    // change between orthographic and perspective view
    //
    eventBus.subscribe(EVENTS.GUI_CAMERA_ORTHO, (payload) => {
        
        if (camera.mode == Camera.PERSPECTIVE_CAMERA) {
            // TODO: hardcoded vars
            const distance = payload && payload.distance ? payload.distance : 26;
            setOrthoMode(distance);
            camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        } else {
            setOrthoMode(payload.distance);
        }

        function setOrthoMode(distance) {
            const aspect =
                scene.getEngine().getRenderingCanvasClientRect().height /
                scene.getEngine().getRenderingCanvasClientRect().width;
            camera.orthoLeft = -distance / 3;
            camera.orthoRight = distance / 3;
            camera.orthoBottom = camera.orthoLeft * aspect;
            camera.orthoTop = camera.orthoRight * aspect;
        }
    });

    // change to perspective mode
    eventBus.subscribe(EVENTS.GUI_CAMERA_PERSPECTIVE, (payload) => {
        if (camera.mode == Camera.ORTHOGRAPHIC_CAMERA) {
            camera.mode = Camera.PERSPECTIVE_CAMERA;
        } else {
            if (payload.fov) {
                camera.fov = payload.fov;
            }
        }
    });

    // CAMERA OPTIONS...
    eventBus.subscribe(EVENTS.GUI_CAMERA_OPTIONS, () => {
        // get camera details to send back to gui
        const data = {};
        data.mode = camera.mode;
        if (data.mode == Camera.PERSPECTIVE_CAMERA) {
            data.fov = camera.fov;
        } else {
            data.distance = camera.orthoRight * 3;
        }
        data.aspect =
            scene.getEngine().getRenderingCanvasClientRect().height /
            scene.getEngine().getRenderingCanvasClientRect().width;
        eventBus.dispatch(EVENTS.CAMERA_INFO, data);
    });

    // CAMERA mode toggle button
    eventBus.subscribe(EVENTS.GUI_CAMERA_FREEZE_TOGGLE, () => {
        if (getCameraActive(camera)) {
            // detach mouse controls from camera
            // and set up drawing mode
            camera.detachControl(canvas);
            eventBus.dispatch(EVENTS.CAMERA_FROZEN);
        } else {
            // kill drawing mode and attach
            // mouse input to camera...
            camera.attachControl(canvas, true);
            eventBus.dispatch(EVENTS.CAMERA_UNFROZEN);
        }
    });

    // switch between camera mode and edit mode
    eventBus.subscribe(EVENTS.MODE_EDIT, () => {
        if (getCameraActive(camera)) {
            camera.detachControl(canvas);
        }
    });

    eventBus.subscribe(EVENTS.MODE_CAMERA, () => {
        camera.attachControl(canvas, true);
    });


    // listen for double click, focus the camera
    canvas.addEventListener("dblclick", function () {
        if (getCameraActive(camera)) {
            const picked = scene.pick(scene.pointerX, scene.pointerY);
            animateCameraTo(scene,
                picked.pickedPoint.x, // targetx
                picked.pickedPoint.y,
                picked.pickedPoint.z, //
                camera.position.x,
                5, // location y
                camera.position.z,
                5, // spped
                2
            ); // framecount
        }
    });

}