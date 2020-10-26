import { CubicEase } from "@babylonjs/core/Animations/easing";
import { EasingFunction } from "@babylonjs/core/Animations/easing";
import { Animation } from "@babylonjs/core/Animations/animation";
import {  Vector3 } from "@babylonjs/core/Maths/math";

// animation function adapted from
// https://www.html5gamedevs.com/topic/37992-animating-arcrotatecamera-settarget/
export function animateCameraTo(scene,
  targetX,
  targetY,
  targetZ,
  locationX,
  locationY,
  locationZ,
  speed,
  frameCount
) {
  let ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  let activCam = scene.activeCamera;
  let cameraTarget = new Vector3(
    targetX + (Math.random() * (0.001 - 0.002) + 0.002),
    targetY,
    targetZ
  );
  let cameraPosition = new Vector3(locationX, locationY, locationZ);
  Animation.CreateAndStartAnimation(
    "at4",
    activCam,
    "position",
    speed,
    frameCount,
    activCam.position,
    cameraPosition,
    0,
    ease
  );
  Animation.CreateAndStartAnimation(
    "at5",
    activCam,
    "target",
    speed,
    frameCount,
    activCam.target,
    cameraTarget,
    0,
    ease
  );
}
