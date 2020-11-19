import { EVENTS } from "../event/types";
import { SceneSerializer } from "@babylonjs/core/Misc/sceneSerializer";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

export function initFileController(state, bus, engine) {
    // file event handlers

    bus.subscribe(EVENTS.SCENE_SAVE, (item) => {
        // console.log("SAVE: ", item)

        const serializedScene = SceneSerializer.Serialize(state.scene);
        // const strScene = JSON.stringify(serializedScene);

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

        fetch("http://localhost:3000/api/save", data)
            .then((res) => res.json())
            .then((res) => {
                console.log("Saving scene ");
                console.log(res);
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    });

    bus.subscribe(EVENTS.SCENE_OPEN, (item) => {
        console.log(state.scene);

        // we have to delete everything to load a new scene...

        if (state.scene.meshes.length > 0) {
            
            state.scene.meshes.forEach((mesh) => {
                console.log("deleteing ", mesh.name)
                state.scene.removeMesh(mesh);
                mesh.dispose()
            });

            // state.scene.materials

            // items.forEach((item) => {
            //     state.scene.removeMesh(item);
            //     item.dispose();
            // });
        }

        const fname = item.name; // requires validation!
        // get existing lights and cameras...
        const cam = state.scene.getCameraByName("camera1");
        const sun = state.scene.getLightByName("sun");
        // const ground = state.scene.getMeshByName("ground1");
        const hemi = state.scene.getLightByName("hemiLight");

        cam.name = "camera1-old";
        sun.name = "sun-old";
        hemi.name = "hemiLight-old";
        // ground.name = "ground-old";

        SceneLoader.AppendAsync(
            "",
            `http://localhost:3000/api/open/${fname}`,
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
                // state.scene.removeLight(sun);
                state.scene.removeLight(hemi);
                state.scene.removeLight(state.scene.getLightByName("sun"));
                sun.name = "sun";
                // state.scene.removeMesh(ground);
                // ground.dispose();
                const grid = state.scene.getMaterialByName("gridMaterial");
                state.scene.getMeshByName("ground1").material = grid;
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
