import { EVENTS } from "../event/types";
import { SceneSerializer } from "@babylonjs/core/Misc/sceneSerializer";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { initEditor } from "./editor";
import { initState } from "./scene"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
export function initFileController(state) {
    // file event handlers

    state.bus.subscribe(EVENTS.SCENE_SAVE, (item) => {
        
        state.outline.reset();
        state.bus.dispatch(EVENTS.MODEL_UNSELECT);
        
        state.scene.metadata.groundLevel = state.groundLevel.get()
        state.scene.metadata.nameCounter = state.nameCounter.get();
        
        const serializedScene = SceneSerializer.Serialize(state.scene);
        

        const data = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: item.name,
                data: serializedScene,
            }),
        };

        fetch(state.url + "/api/save", data)
            .then((res) => res.json())
            .then((res) => {
                console.log("Saving scene ");
                console.log(res);
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    });

    state.bus.subscribe(EVENTS.SCENE_OPEN, (item) => {
   
        state.outline.reset();
        // state.canvas.removeEventListener("contextmenu", state.handlerContextMenu);
        // state.scene.dispose();
        // state.engine.dispose();
        // state.camera.dispose();        

        // initState(state);
        // initEditor(state);
        

        const fname = item.name; // requires validation!
        // get existing lights and cameras...
        const cam = state.scene.getCameraByName("camera1");
        const sun = state.scene.getLightByName("sun");
        sun.dispose();
        const ground = state.scene.getMeshByName("ground1");
        ground.dispose();
        const hemi = state.scene.getLightByName("hemiLight");
        hemi.dispose();
        const skybox = state.scene.getMeshByName("skyBox");
        skybox.dispose();
        const grid = state.scene.getMaterialByName("gridMaterial");
        // grid.dispose();
        const sky = state.scene.getMaterialByName("skyMaterial");
        sky.dispose();

        cam.name = "camera1-orig";
        // sun.name = "sun-orig";
        // hemi.name = "hemiLight-orig";
        // ground.name = "ground1-orig";
        // skybox.name = "skybox-orig";





        SceneLoader.AppendAsync( 
            "",            
            `${state.url}/api/open/${fname}`,
            state.scene,
            (event) => {
                console.log(event);
            }
        )
            .then((data) => {
                console.log("scene loaded", data);
                console.log("SCENE: ", state.scene);
            })
            .catch((err) => {
                console.log("err", err);
            })
            .finally(() => {

                state.scene.activeCamera = state.scene.getCameraByName(
                    "camera1"
                );
                
                state.camera = state.scene.activeCamera

                state.scene.removeCamera(cam);
                cam.dispose();
               
                // get rid of new sun 
                const newsun = state.scene.getLightByName("sun")
                // state.scene.removeLight(newsun);
                // newsun.dispose();
                // sun.name="sun"
                
                state.scene.removeLight(sun);
                sun.dispose();

                state.shadowGenerator = newsun.getShadowGenerator();

                state.scene.removeLight(hemi);
                hemi.dispose();

                state.scene.removeMesh(ground);
                ground.dispose();

                // const grid = state.scene.getMaterialByName("gridMaterial");
                state.scene.getMeshByName("ground1").material = grid;
                
                state.groundLevel.set(state.scene.metadata.groundLevel);                
                if(!state.scene.metadata.dynamicModels) {
                    state.scene.metadata.dynamicModels = [];
                }

                state.nameCounter.set(state.scene.metadata.nameCounter);
                state.nameCounter.increment();

                state.bus.dispatch(EVENTS.MODE_CAMERA);
            });

        // not quite so simple, this detaches all of our event handlers :-(

        // SceneLoader.LoadAsync(
        //     "",
        //     `http://localhost:3000/api/open/${fname}`,
        //     engine, event=>{ console.log(event)},
        // )
        //     .then((scene) => {
        //         state.scene.dispose();
        //         state.scene = scene;
        //         state.scene.setActiveCameraByName("camera1");
        //     })
        //     .catch((err) => {
        //         console.log("err", err);
        //     });

        // fetch(`http://localhost:3000/api/open/${fname}`)
        //     .then(res => res.json())
        //     .then(res => {
        //         console.log(res.name);
        //         console.log(res.data);
        //     })
        //     .catch(err => {
        //         console.log("ERROR: ", err)
        //     })
    });
}
