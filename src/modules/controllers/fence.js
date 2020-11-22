import {
    StandardMaterial
} from "@babylonjs/core/Materials/standardMaterial";
import {
    Texture
} from "@babylonjs/core/Materials/Textures/texture";
import {
    Color3
} from "@babylonjs/core/Maths/math";
import {
    createFence,
    createFence2
} from "../builder/createFence";
import {
    EVENTS
} from "../event/types";
import {
    Counter
} from "../utility/counter";
import {
    setUVScale
} from "../utility/setUVScale";

export function initFenceController(state) {

    const counter = new Counter();
    const url = "http://localhost:3000/"


    state.bus.subscribe(EVENTS.CREATE_FENCE, data => {

        const fenceMaterialName = "fenceMaterial" + data.fence.name;
        let material = state.scene.getMaterialByName(fenceMaterialName);

        if (!material) {
            material = new StandardMaterial(fenceMaterialName, state.scene);
            const textureURL = url + data.fence.path + data.fence.file;
            material.diffuseTexture = new Texture(textureURL);
            material.specularColor = new Color3(0.0, 0.0, 0.0);
            material.specularPower = 0;
            material.diffuseTexture.uScale = data.fence.uScale;
            material.diffuseTexture.vScale = data.fence.vScale;
            material.diffuseTexture.hasAlpha = data.fence.hasAlpha;
        }

        const fence = createFence2(state.scene, state.outline, data.fence.height, counter);

        fence.receiveShadows = true;
        state.shadowGenerator.addShadowCaster(fence);
        // change UV Kind so texture in proportion to size of mesh
        setUVScale(fence, state.outline.totalLength, 2);
        // apply the material 
        fence.material = material;
    });

}