import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh";
import { setUVScale } from "../utility/setUVScale";
import * as EarcutRef from "earcut";
// import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo";
import { Mesh } from "@babylonjs/core/Meshes";
import { fixPivotPointOffCentre } from '../utility/fixPivot';

export function createGroundPolygon(scene, outline, groundLevel) {    

    console.log("outline is ", outline)
    if (outline.getLines().length > 2) {
        const corners = [];
        outline.getLines().forEach((line) => {
            corners.push(new Vector2(line.x, line.z));
        });
        //TODO: create a better naming scheme
        const polygon_triangulation = new PolygonMeshBuilder(
            "GroundCover" + groundLevel,
            corners,
            scene,
            EarcutRef
        );

        const polygon = polygon_triangulation.build(false);
        polygon.position.y = groundLevel;

        polygon.receiveShadows = true;

        // rescale UV kind for texture mapping
        setUVScale(
            polygon,
            outline.getExtents().length,
            outline.getExtents().width
        );

        fixPivotPointOffCentre(polygon, groundLevel);

        return polygon;
    }
}
