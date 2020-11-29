import {
    EVENTS
} from "../event/types"
import {
    AssetContainer
} from "@babylonjs/core/assetContainer";
import {
    KeepAssets
} from "@babylonjs/core/assetContainer"
import {
    ShadowGenerator
} from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import {
    createCamera,
    createOutlineScene
} from '../builder/scene'
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { GroundLevel } from "../utility/groundLevel";

import { Engine } from "@babylonjs/core/Engines/engine";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { StringLine } from "../builder/stringLine";
import { EventBus } from "../event/eventBus";


export function initScene(state) {
    state.bus.subscribe(EVENTS.CLEAR_DO, () => {
       location.reload();        
    });
}

export function initState(state) {
    state.bus = new EventBus();
    state.engine = new Engine(state.canvas, true, {
        stencil: true
    });
    state.scene = createOutlineScene(state.engine, {
        stencil: true
    });
    state.adt = new AdvancedDynamicTexture.CreateFullscreenUI("UI", true, state.scene);
    state.camera = createCamera(state.canvas, state.scene);
    state.utilityLayer = new UtilityLayerRenderer(state.scene);
    state.shadowGenerator = new ShadowGenerator(2048, state.scene.getLightByName("sun"));
    state.groundLevel = new GroundLevel();
    // state.shadowGenerator.usePoissonSampling = true;
    state.shadowGenerator.usePercentageCloserFiltering = true;
    state.outline = new StringLine(state, state.adt, false, state.bus);
    state.url = "http://localhost:3000";
    state.selected = null; // selected model
}