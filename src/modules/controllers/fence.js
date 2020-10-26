import { Color3 } from "@babylonjs/core/Maths/math";
import { createFence } from "../builder/createFence";
import {EVENTS } from "../event/types";
import { Counter } from "../utility/counter";

export function initFenceController(eventBus, scene, outline, shadowGenerator) {

    const counter = new Counter();

    // FENCE - currently making a fence!
eventBus.subscribe(EVENTS.GUI_FENCE, (data) => {
    createFence(
        scene,
        shadowGenerator,
        outline,
        data,
        counter,
        new Color3(0.3, 0.2, 0)
    );
});

eventBus.subscribe(EVENTS.GUI_WHITE_FENCE, (data) => {
    createFence(
        scene,
        shadowGenerator,
        outline,
        data,
        counter,
        new Color3(1, 1, 1)
    );
});

// FENCE - currently making a fence!
eventBus.subscribe(EVENTS.GUI_LIGHT_FENCE, (data) => {
    createFence(
        scene,
        shadowGenerator,
        outline,
        data,
        counter,
        new Color3(0.7, 0.5, 0.3),
        "fence"
    );
});

eventBus.subscribe(EVENTS.GUI_BLUE_FENCE, (data) => {
    createFence(
        scene,
        shadowGenerator,
        outline,
        data,
        counter,
        new Color3(0.0, 0.4, 0.6),
        "woodFence"
    );
});




}