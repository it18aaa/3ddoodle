import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
// import { GrassProceduralTexture } from "@babylonjs/procedural-textures/grass/grassProceduralTexture";

// import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

export const createCamera = function (canvas, scene) {
 
  const camera = new ArcRotateCamera(
    "camera1",
    -Math.PI / 1,
    (2 * Math.PI) / 12,
    10,
    new Vector3(0, 1, 0),
    scene
  );

  camera.wheelPrecision = 50;
  camera.fov = 25 * Math.PI /180
  //camera.panningSensibility = 1;
  camera.angularSensibilityX = 6400;
  camera.angularSensibilityY = 4400;
//   camera.lowerBetaLimit = -0.01;
//   camera.upperBetaLimit = Math.PI / 2 - 0.1;

  camera.setTarget(Vector3.Zero());

  return camera;
};

export const createOutlineScene = function (engine) {
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0.8, 0.94, 1);
  const light = new HemisphericLight(
    "hemiLight",
    new Vector3(-11, 15, 0),
    scene
  );
  light.intensity = 0.5;


  const sunlight = new DirectionalLight("sun", new Vector3(20,-20,20),scene)
  sunlight.intensity = 0.9;

  // create a built in ground shape
  const ground = MeshBuilder.CreateGround(
    "ground1",
    {
      height: 50,
      width: 50,
      subdivisions: 20,
    },
    scene
  );

  const gridMaterial = new GridMaterial("gridMaterial", scene);
  gridMaterial.mainColor = new Color3(0.94, 0.94, 0.94);
  gridMaterial.lineColor = new Color3(0.4,0.4,0.4);
  gridMaterial.minorUnitVisibility = .55;
  gridMaterial.majorUnitFrequency = 5;
  gridMaterial.opacity = 0.9;

  ground.material = gridMaterial;


  const woodenFenceMaterial = new StandardMaterial("woodFence", scene);
  woodenFenceMaterial.diffuseTexture = new Texture("/img/wood.jpg")
  woodenFenceMaterial.diffuseTexture.uScale = 1;
  woodenFenceMaterial.diffuseTexture.vScale = 1;

  const fenceMat = new StandardMaterial("fence", scene);
  fenceMat.diffuseTexture = new Texture("/img/fence3.png");
  fenceMat.diffuseTexture.uScale = .5;
  fenceMat.diffuseTexture.vScale = .5;
  fenceMat.diffuseTexture.hasAlpha = true;
  fenceMat.backFaceCulling = true;

  return scene;
}
