import "@babylonjs/core/Meshes/meshBuilder";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Plane } from "@babylonjs/core/Maths/math.plane"
import { Ray } from "@babylonjs/core/Culling/ray";
import { Mesh } from "@babylonjs/core/Meshes";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder/";


// this is the mitred extrude function from the BabylonJS website
//
export function mitredExtrude(name, options, scene) {
    var shape = options.shape;
    var path = options.path;
    var closed = options.close || false;        

    var nbPoints = path.length;
    var line = Vector3.Zero();
    var nextLine = Vector3.Zero();
    var axisX = Vector3.Zero();
    var axisY = Vector3.Zero();
    var axisZ = Vector3.Zero();
    var nextAxisX = Vector3.Zero();
    var nextAxisY = Vector3.Zero();
    var nextAxisZ = Vector3.Zero();
    var startPoint = Vector3.Zero();
    var nextStartPoint = Vector3.Zero();
    var bisector = Vector3.Zero();
    var point = Vector3.Zero();
    var prjctZ = 0;
    var distance = 0;
    var ray;

    var allPaths = [];

    for (var s = 0; s < shape.length; s++) {
        path[1].subtractToRef(path[0], line);
        axisZ = line.clone().normalize();
        axisX = Vector3.Cross(scene.activeCamera.position, axisZ).normalize();
        axisY = Vector3.Cross(axisZ, axisX);
        startPoint = path[0].add(axisX.scale(shape[s].x)).add(axisY.scale(shape[s].y));
        var ribbonPath = [startPoint.clone()];
        for(var p = 0; p < nbPoints - 2; p++) {
            path[p + 2].subtractToRef(path[p + 1], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            var planeParallel = Vector3.Cross(nextAxisZ, axisZ);
            var planeNormal = Vector3.Cross(planeParallel, bisector);
            var plane = Plane.FromPositionAndNormal(path[p + 1], planeNormal);
            var ray = new Ray(startPoint, axisZ);
            var distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());

            axisX = nextAxisX.clone();
            axisY = nextAxisY.clone();
            axisZ = nextAxisZ.clone();
            startPoint = nextStartPoint.clone();
        }
        // Last Point
        if (closed) {
            path[0].subtractToRef(path[nbPoints - 1], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            planeParallel = Vector3.Cross(nextAxisZ, axisZ);
            planeNormal = Vector3.Cross(planeParallel, bisector);
            plane = Plane.FromPositionAndNormal(path[nbPoints - 1], planeNormal);
            ray = new Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());

            axisX = nextAxisX.clone();
            axisY = nextAxisY.clone();
            axisZ = nextAxisZ.clone();
            startPoint = nextStartPoint.clone();

            path[1].subtractToRef(path[0], nextLine);
            nextAxisZ = nextLine.clone().normalize();
            nextAxisX = Vector3.Cross(scene.activeCamera.position, nextAxisZ).normalize();
            nextAxisY = Vector3.Cross(nextAxisZ, nextAxisX);
            nextAxisZ.subtractToRef(axisZ, bisector);
            planeParallel = Vector3.Cross(nextAxisZ, axisZ);
            planeNormal = Vector3.Cross(planeParallel, bisector);
            plane = Plane.FromPositionAndNormal(path[0], planeNormal);
            ray = new BABYLON.Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.shift();
            ribbonPath.unshift(nextStartPoint.clone());

        }
        else {
            planeNormal = axisZ;
            plane = Plane.FromPositionAndNormal(path[nbPoints - 1], planeNormal);
            ray = new Ray(startPoint, axisZ);
            distance = ray.intersectsPlane(plane);
            startPoint.addToRef(axisZ.scale(distance), nextStartPoint);
            ribbonPath.push(nextStartPoint.clone());

        }
        allPaths.push(ribbonPath);

    }
    var ribbon = MeshBuilder.CreateRibbon("ribbon", {pathArray: allPaths, sideOrientation: Mesh.DOUBLESIDE, closeArray: true, closePath: closed}, scene);

        return ribbon;
} 