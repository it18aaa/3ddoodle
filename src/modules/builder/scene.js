import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { SkyMaterial } from "@babylonjs/materials/sky/skyMaterial";
// import { GrassProceduralTexture } from "@babylonjs/procedural-textures/grass/grassProceduralTexture";

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

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
    camera.fov = (25 * Math.PI) / 180;
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
    light.intensity = 0.12;

    const sunlight = new DirectionalLight("sun", new Vector3(0, -40, 0), scene);
    sunlight.intensity = 2;

    // const sunSphere = SphereBuilder.CreateSphere("sunSphere", { diameter: 2 }, scene);
    // sunSphere.ambientColor = Color3.Yellow();

    // let sunMat = new StandardMaterial("sunMaterial", scene);
    // sunMat.emissiveColor = new Color3.Yellow();
    // sunSphere.material = sunMat;
    // sunSphere.position = new Vector3(0,50, 0);

    // create skybox -
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    const skybox = Mesh.CreateBox("skyBox", 1000.0, scene);
    skybox.material = skyMaterial;
    skyMaterial.useSunPosition = true;
    skyMaterial.sunPosition = new Vector3(0, 100, 0);
    skyMaterial.luminance = 0.4;
    skyMaterial.turbidity = 1;
    skyMaterial.rayleigh = 1;

    // skyMaterial.mieDirectionalG = 0.8;
    // skyMaterial.mieCoefficient = 0.005;


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
    gridMaterial.mainColor = new Color3(0.6, 0.7, 0.6);
    gridMaterial.lineColor = new Color3(0.4, 0.4, 0.4);
    gridMaterial.minorUnitVisibility = 0.55;
    gridMaterial.majorUnitFrequency = 5;
    // gridMaterial.opacity = 0.9;

    ground.material = gridMaterial;

    //   const woodenFenceMaterial = new StandardMaterial("woodFence", scene);
    //   woodenFenceMaterial.diffuseTexture = new Texture("/img/wood.jpg")
    //   woodenFenceMaterial.diffuseTexture.uScale = 1;
    //   woodenFenceMaterial.diffuseTexture.vScale = 1;

    //   const fenceMat = new StandardMaterial("fence", scene);
    //   fenceMat.diffuseTexture = new Texture("/img/fence3.png");
    //   fenceMat.diffuseTexture.uScale = .5;
    //   fenceMat.diffuseTexture.vScale = .5;
    //   fenceMat.diffuseTexture.hasAlpha = true;
    //   fenceMat.backFaceCulling = true;

    return scene;
};
