import {
    EVENTS
} from '../event/types';
import {
    SceneSerializer
} from "@babylonjs/core/Misc/sceneSerializer"
import {
    PostProcess
} from '@babylonjs/core/PostProcesses/postProcess';

export function initFileController(scene, bus) {

    // file event handlers

    bus.subscribe(EVENTS.SCENE_SAVE, item => {
        // console.log("SAVE: ", item)

        const serializedScene = SceneSerializer.Serialize(scene);
        // const strScene = JSON.stringify(serializedScene);

        const data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: item.name,
                data: serializedScene
            })
        };
        

        fetch('http://localhost:3000/api/save', data)
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log('error: ', err)
            })

    });


    bus.subscribe(EVENTS.SCENE_OPEN, item => {
        console.log("OPEN: ", item);

        const fname = item.name // requires validation!

        fetch(`http://localhost:3000/api/open/${fname}`)
            .then(res => res.json())
            .then(res => {
                console.log(res.name);
                console.log(res.data)
            })
            .catch(err => {
                console.log("ERROR: ", err)
            })
    })

}