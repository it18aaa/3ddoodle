import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { GrassProceduralTexture } from "@babylonjs/procedural-textures/grass/grassProceduralTexture";

import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

export const createCamera = function (canvas, scene) {
  // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
  //const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene);
  const camera = new ArcRotateCamera(
    "camera1",
    -Math.PI / 1,
    (2 * Math.PI) / 12,
    10,
    new Vector3(0, 1, 0),
    scene
  );
  camera.wheelPrecision = 50;
  //camera.panningSensibility = 1;
  camera.angularSensibilityX = 6400;
  camera.angularSensibilityY = 4400;
  camera.lowerBetaLimit = 0.01;
  camera.upperBetaLimit = Math.PI / 2 - 0.1;

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

  light.intensity = 0.9;

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


  const grassMaterial = new StandardMaterial("grassMaterial", scene);
//   const grassTexture = new GrassProceduralTexture("grassTexture", 256, scene);
const grassTexture = new Texture("/img/grass006.jpg");
  grassMaterial.diffuseTexture = grassTexture;
  grassMaterial.diffuseTexture.uScale = 10;
  grassMaterial.diffuseTexture.vScale = 10;
  grassMaterial.specularColor = new Color3(0.2, 0.2, 0.2);


  const woodenFenceMaterial = new StandardMaterial("woodFence", scene);
  woodenFenceMaterial.diffuseTexture = new Texture("/img/wood.jpg")
  woodenFenceMaterial.diffuseTexture.uScale = 14;
  woodenFenceMaterial.diffuseTexture.vScale = 1;

  const fenceMat = new StandardMaterial("fence", scene);
  fenceMat.diffuseTexture = new Texture("/img/fence1.png");
  fenceMat.diffuseTexture.uScale = 1;
  fenceMat.diffuseTexture.vScale = 1;
  fenceMat.diffuseTexture.hasAlpha = true;
  fenceMat.backFaceCulling = false;

  return scene;
}

export const createScene = function (engine) {
  // create a basic BJS Scene object
  const scene = new Scene(engine);

  // create a built in sphere shape
  const sphere = MeshBuilder.CreateSphere(
    "sphere",
    {
      segments: 64,
      diameter: 2,
    },
    scene
  );

  const cube = MeshBuilder.CreateBox(
    "box",
    {
      size: 4,
    },
    scene
  );

  cube.position.x = 3;
  cube.position.z = 4;
  cube.position.y = 2;

  let box = [];
  for (let i = 0; i < 20; i++) {
    box[i] = MeshBuilder.CreateBox(
      `box${i}`,
      { width: 0.6, depth: 0.6, height: 0.03 },
      scene
    );

    box[i].position.x = -3;
    box[i].position.z = i * 1;
    box[i].position.y = 0.02;
  }

  // Move the sphere upward 1/2 of its height
  sphere.position.y = 1;

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

  const boxMaterial = new StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new Color3(0.3, 0.2, 0.0);
  boxMaterial.specularColor = new Color3(1, 0, 0);
  //boxMaterial.emissiveColor = new Color3(.1,.1,.1);
  boxMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);

  const gridMaterial = new GridMaterial("gridMaterial", scene);
  gridMaterial.lineColor = new Color3(0.3, 0.6, 0.4);
  gridMaterial.mainColor = new Color3(0.6, 0.9, 0.8);
  gridMaterial.minorUnitVisibility = 0.25;
  gridMaterial.majorUnitFrequency = 5;

  //   ground.material = gridMaterial;

  scene.clearColor = new Color3(0.7, 0.85, 1);

  const light = new HemisphericLight(
    "hemiLight",
    new Vector3(-11, 15, 0),
    scene
  );

  light.intensity = 0.1;

  const dlight = new DirectionalLight(
    "DirectionalLight",
    new Vector3(0, -20, 0),
    scene
  );
  dlight.intensity = 0.8;

  // shadows
  const shadowGenerator = new ShadowGenerator(512, dlight);
  shadowGenerator.addShadowCaster(sphere);
  shadowGenerator.addShadowCaster(cube);

  box.forEach((b) => {
    shadowGenerator.addShadowCaster(b);
    b.receiveShadows = true;
  });

  ground.receiveShadows = true;
  sphere.receiveShadows = true;
  cube.receiveShadows = true;
  gridMaterial.receiveShadows = true;

  shadowGenerator.usePercentageCloserFiltering = true;

  const grassMaterial = new StandardMaterial("grassMaterial", scene);
  const grassTexture = new GrassProceduralTexture("grassTexture", 256, scene);
  grassMaterial.diffuseTexture = grassTexture;
  grassMaterial.diffuseTexture.uScale = 10;
  grassMaterial.diffuseTexture.vScale = 10;
  grassMaterial.specularColor = new Color3(0.2, 0.2, 0.2);

  // grassMaterial.ambientTexture.
  ground.material = grassMaterial;

  const myMaterial = new StandardMaterial("myMaterial", scene);
  myMaterial.diffuseTexture = new Texture("/img/grass006.jpg");

  const woodenFenceMaterial = new StandardMaterial("woodenFenceMaterial", scene);
  woodenFenceMaterial.diffuseText = new Texture("/img/wood.jpg")

  woodenFenceMaterial.diffuseTexture.uScale = 20;
  woodenFenceMaterial.diffuseTexture.vScale = 20;


  ground.material = myMaterial;
  myMaterial.diffuseTexture.uScale = 20;
  myMaterial.diffuseTexture.vScale = 20;
  myMaterial.specularColor = new Color3(0.2, 0.2, 0.2);

  // sphere.material = grassMaterial;
  cube.material = boxMaterial;

  SceneLoader.ImportMesh(
    ["monkey1"],
    "./",
    "monkey2.babylon",
    scene,
    (meshes) => {
      meshes[0].position.x = 5;
      meshes[0].position.z = -10;
      shadowGenerator.addShadowCaster(meshes[0])
    }
  );


  SceneLoader.ImportMesh(
    ["pavillion"],
    "./",
    "pav.babylon",
    scene,
    (meshes) => {
      meshes[0].position.x = -7;
      meshes[0].position.z = -10;
      meshes[0].scaling = new Vector3(.2, .2, .2);
      shadowGenerator.addShadowCaster(meshes[0])
    }
  );

  return scene;
};

export const createAltScene = function (engine) {
  const scene = new Scene(engine);




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
  gridMaterial.lineColor = new Color3(0.3, 0.6, 0.4);
  gridMaterial.mainColor = new Color3(0.6, 0.9, 0.8);
  gridMaterial.minorUnitVisibility = 0.25;
  gridMaterial.majorUnitFrequency = 5;

  ground.material = gridMaterial;

  return scene;
};
