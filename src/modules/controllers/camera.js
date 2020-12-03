import { EVENTS } from "../event/types";
import { animateCameraTo } from "../utility/animateCameraTo";
import { Camera } from "@babylonjs/core/Cameras/camera";

// helper function to determine if the camera has
// controls attached to it
export function getCameraActive(camera) {
    return camera.inputs.attachedElement ? true : false;
}

export function initCameraController(state) {
    const camera = state.scene.activeCamera;

    // attach camera to scene to start off with...
    camera.attachControl(state.canvas, false);

    state.bus.subscribe(EVENTS.CAM_DISTANCE, (distance) => {
        const cam = state.scene.activeCamera;
        if (cam.mode == Camera.PERSPECTIVE_CAMERA) {
            cam.radius = distance;
        } else if (cam.mode == Camera.ORTHOGRAPHIC_CAMERA) {
            setOrthoMode(cam, distance);
        }
    });

    state.bus.subscribe(EVENTS.CAM_FOV, (fov) => {
        const cam = state.scene.activeCamera;
        if (cam.mode == Camera.PERSPECTIVE_CAMERA) {
            // set field of view, converting degrees to radians
            state.scene.activeCamera.fov = fov * (Math.PI / 180);
        }
    });

    state.bus.subscribe(EVENTS.CAM_HEIGHT, (beta) => {
        // round the number to two decimal places to avoid
        // NaN error on camera beta in alpha rotation
        state.scene.activeCamera.beta = Math.round(beta * 100)/100;
        // console.log(cam)
        // cam.attachControl();
    });

    //  CAMERA ORIENTATED EVENTS>...
    // change between orthographic and perspective view
    //
    state.bus.subscribe(EVENTS.GUI_CAMERA_ORTHO, (payload) => {
        const camera = state.scene.activeCamera;
        if (camera.mode == Camera.PERSPECTIVE_CAMERA) {
            // TODO: hardcoded vars
            const distance =
                payload && payload.distance ? payload.distance : 26;
            setOrthoMode(camera, distance);
            camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        } else {
            setOrthoMode(camera, payload.distance);
        }
    });

    function setOrthoMode(camera, distance) {
        const aspect =
            state.scene.getEngine().getRenderingCanvasClientRect().height /
            state.scene.getEngine().getRenderingCanvasClientRect().width;
        camera.orthoLeft = -distance / 3;
        camera.orthoRight = distance / 3;
        camera.orthoBottom = camera.orthoLeft * aspect;
        camera.orthoTop = camera.orthoRight * aspect;
    }

    // change to perspective mode
    state.bus.subscribe(EVENTS.GUI_CAMERA_PERSPECTIVE, (payload) => {
        const camera = state.scene.activeCamera;
        if (camera.mode == Camera.ORTHOGRAPHIC_CAMERA) {
            camera.mode = Camera.PERSPECTIVE_CAMERA;
        } else {
            if (payload.fov) {
                camera.fov = payload.fov;
            }
        }
    });

    // CAMERA OPTIONS... this event is a cry for info
    // from the gui, so we send back info!
    state.bus.subscribe(EVENTS.GUI_CAMERA_OPTIONS, () => {
        const camera = state.scene.activeCamera;
        // get camera details to send back to gui
        const data = {};
        data.mode = camera.mode;
        if (data.mode == Camera.PERSPECTIVE_CAMERA) {
            data.fov = camera.fov;
        } else {
            data.distance = camera.orthoRight * 3;
        }
        data.aspect =
            state.scene.getEngine().getRenderingCanvasClientRect().height /
            state.scene.getEngine().getRenderingCanvasClientRect().width;
        state.bus.dispatch(EVENTS.CAMERA_INFO, data);
    });

    // CAMERA mode toggle button
    state.bus.subscribe(EVENTS.MODE_TOGGLE, () => {
        const camera = state.scene.activeCamera;
        if (getCameraActive(camera)) {
            // detach mouse controls from camera
            // and set up drawing mode
            state.bus.dispatch(EVENTS.MODE_EDIT);
        } else {
            // kill drawing mode and attach
            // mouse input to camera...
            state.bus.dispatch(EVENTS.MODE_CAMERA);
        }
    });

    // switch between camera mode and edit mode
    state.bus.subscribe(EVENTS.MODE_EDIT, () => {
        const camera = state.scene.activeCamera;
        if (getCameraActive(camera)) {
            camera.detachControl(state.canvas);
        }
    });

    state.bus.subscribe(EVENTS.MODE_CAMERA, () => {
        const camera = state.scene.activeCamera;
        camera.attachControl(state.canvas, true);
    });

    // listen for double click, focus the camera
    state.canvas.addEventListener("dblclick", function () {
        const camera = state.scene.activeCamera;
        const scene = state.scene;

        if (getCameraActive(camera)) {
            const picked = scene.pick(scene.pointerX, scene.pointerY);
            animateCameraTo(
                scene,
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
