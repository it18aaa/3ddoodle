
import { EVENTS } from '../event/types';

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { createGroundPolygon } from "../builder/createGround";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import { Color3 } from "@babylonjs/core/Maths/math.color";


export function initGroundController(state) {  
    
    state.bus.subscribe(EVENTS.CREATE_GROUND, details => {        
  
        // if material exists already, get a ref to it
        // otherwise load it  
        const materialName = "groundMaterial" + details.texture.name;
        let material = state.scene.getMaterialByName(materialName);
        if (!material) {
            material = new StandardMaterial(materialName, state.scene);
            const textureURL = state.url + details.texture.path + details.texture.file;
            // console.log("TextureURL: ", textureURL);
            material.diffuseTexture = new Texture(textureURL);
            material.specularColor = new Color3(0.0, 0.0, 0.0);
            material.specularPower = 0;
            material.diffuseTexture.uScale = details.texture.uScale;
            material.diffuseTexture.uScale = details.texture.vScale;
        }

        // get a polygon
        const poly = createGroundPolygon(state.scene, state.outline, state.groundLevel.get());

        poly.material = material;

        // micro increment ground level
        state.groundLevel.increment();
    });
}

