import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh";
import { setUVScale } from '../utility/setUVScale';
import * as EarcutRef from "earcut";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Vector2 } from '@babylonjs/core/Maths/math'


export function createGroundPolygon(scene, outline, groundLevel) {
  if (outline.getLines().length > 2) {
    const corners = [];
    outline.getLines().forEach((line) => {
      corners.push(new Vector2(line.x, line.z));
    });
    const polygon_triangulation = new PolygonMeshBuilder(
      "TODO_CREATE_NAME",
      corners,
      scene,
      EarcutRef
    );

    const polygon = polygon_triangulation.build(false);
    polygon.position.y = groundLevel.get();

    polygon.receiveShadows = true;

    // rescale UV kind for texture mapping
    setUVScale(
      polygon,
      outline.getExtents().length,
      outline.getExtents().width
    );
    return polygon;
  }
}
