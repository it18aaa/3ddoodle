import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";

// utility method created by CeeJay on html5gameDevs
// this changes the UV scale of a mesh to fit a texture
// so that the same texture can be used on multiple
// meshes, of differing sizes.  This is needed for being able to 
// 'paint' different sized meshes.
export function setUVScale(mesh, uScale, vScale) {
    var i,
      UVs = mesh.getVerticesData(VertexBuffer.UVKind),
      len = UVs.length;
  
    if (uScale !== 1) {
      for (i = 0; i < len; i += 2) {
        UVs[i] *= uScale;
      }
    }
    if (vScale !== 1) {
      for (i = 1; i < len; i += 2) {
        UVs[i] *= vScale;
      }
    }
  
    mesh.setVerticesData(VertexBuffer.UVKind, UVs);
  }