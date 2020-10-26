import { Color3 } from "@babylonjs/core/Maths/math";
import { GroundLevel } from "../utility/groundLevel";
import { createGround } from "../builder/createGround";
import {EVENTS } from '../event/types';

export function initGroundController(eventBus, scene, outline) {

    // this increases as new ground items are added...
    const groundLevel = new GroundLevel();

    // make stuff buttons...
    eventBus.subscribe(EVENTS.CREATE_GRASS, () => {
        createGround(
            scene,
            outline,
            groundLevel,
            new Color3(0.2, 0.6, 0.2),
            "grassMaterial"
        );
    });

    eventBus.subscribe(EVENTS.CREATE_PATIO, () => {
        createGround(
            scene,
            outline,
            groundLevel,
            new Color3(0.2, 0.6, 0.2),
            "patio1"
        );
    });

    eventBus.subscribe(EVENTS.CREATE_GRAVEL, () => {
        createGround(
            scene,
            outline,
            groundLevel,
            new Color3(0.2, 0.6, 0.2),
            "gravel1"
        );
    });

    eventBus.subscribe(EVENTS.CREATE_BORDER, () => {
        createGround(scene, outline, groundLevel, new Color3(0.2, 0.2, 0.2));
    });
}