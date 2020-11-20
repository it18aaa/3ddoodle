import { EVENTS } from "../event/types"
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { KeepAssets } from "@babylonjs/core/assetContainer"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

export function initScene(state, bus) {

    bus.subscribe(EVENTS.CLEAR_DO, ()=> {
        const scene = state.scene;
        const keepAssets = new KeepAssets();
        const container = new AssetContainer(scene);

        keepAssets.cameras.push(scene.activeCamera);
        keepAssets.lights.push(scene.getLightByName("sun"));
        keepAssets.lights.push(scene.getLightByName("hemiLight"));
        keepAssets.meshes.push(scene.getMeshByName("ground1"));
        keepAssets.materials.push(scene.getMaterialByName("gridMaterial"));
        keepAssets.textures.push(state.adt)
        keepAssets.meshes.push(scene.getMeshByName("stringLine"));
        console.log(scene);
        container.moveAllFromScene(keepAssets);

        container.getNodes().forEach(node => {
            state.shadowGenerator.removeShadowCaster(node);
        })
        // state.shadowGenerator.dispose();
        // state.shadowGenerator = new ShadowGenerator();
        console.log(scene);
        // container.dispose();
    
    });
}