import {
    SceneLoader
} from "@babylonjs/core/Loading/sceneLoader";
import { EVENTS } from "../event/types";

export function initModelController(eventBus, scene, outline, shadowGenerator, url) {

    eventBus.subscribe(EVENTS.INSERT_MODEL, item => {        
        const lines = outline.getLines();
        
        // check if model loaded, if so, create instance
        // otherwise load up the mesh
        const mesh = scene.getMeshByName(item.model.name);
        if (mesh) {
            // mesh already exists, creating instance of it!
            lines.forEach((point, index) => {
                const instance = mesh.createInstance(item.model.name + index);
                instance.position = point;
                instance.isVisible = true;
                shadowGenerator.addShadowCaster(instance);
            });
    
        } else {
            //  mesh doesn't yet exist, so load it 
            SceneLoader.ImportMesh(
                "",
                url + item.model.path,
                item.model.file,
                scene,
                (meshes) => {
                    console.log(meshes)
                    // get our parent mesh... the parent...
                    const mesh = meshes[0];
                    mesh.name = item.model.name;
                    mesh.isVisible = false;
    
                    // create instances on the basis of how many 
                    // stringline points there are
                    lines.forEach((point, index) => {
                        const instance = mesh.createInstance(item.model.name + index);
    
                        instance.position = point;
                        instance.isVisible = true;
                        shadowGenerator.addShadowCaster(instance);
                    });
                });
        }
    })
}