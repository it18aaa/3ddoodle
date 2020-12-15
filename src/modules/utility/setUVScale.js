import {
    VertexBuffer
} from "@babylonjs/core/Meshes/buffer";

// adapted from utility method created by CeeJay on html5gameDevs
// this changes the UV scale of a mesh to fit a texture
// so that the same texture can be used on multiple
// meshes, of differing sizes.  This is needed for being able to 
// 'paint' different sized meshes.
export function setUVScale(mesh, uScale, vScale) {    
    const UVs = mesh.getVerticesData(VertexBuffer.UVKind);   
    if (uScale !== 1) {
        for (let i = 0; i < UVs.length; i += 2) {
            UVs[i] *= uScale;
        }
    }
    if (vScale !== 1) {
        for (let i = 1; i < UVs.length; i += 2) {
            UVs[i] *= vScale;
        }
    }

    mesh.setVerticesData(VertexBuffer.UVKind, UVs);
}