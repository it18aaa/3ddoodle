import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh";
import { setUVScale } from '../utility/setUVScale';
import * as EarcutRef from "earcut";
// import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Vector2 } from '@babylonjs/core/Maths/math.vector'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo";


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

    // const center2d = findCentre(corners);
    // const center3d = new Vector3( center2d.x, polygon.position.y, center2d.y);

    // polygon.setPivotPoint(center3d)      
    // polygon.showBoundingBox = true;
     polygon.setPivotPoint(polygon.getBoundingInfo().boundingBox.center);
    return polygon;
  }
}


function findCentre(points) {
// find the barycenter of points.length vertices

  let sumX = 0;
  let sumY = 0;
  points.forEach(point => {
    console.log(point)
    sumX += point.x;
    sumY += point.y;
  })
  
  return new Vector2( sumX/points.length, sumY/points.length)
}