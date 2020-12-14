import { EVENTS } from "../event/types";
// import { AssetContainer } from "@babylonjs/core/assetContainer";
// import { KeepAssets } from "@babylonjs/core/assetContainer";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { createCamera, createOutlineScene } from "../builder/scene";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { GroundLevel } from "../utility/groundLevel";
import { Engine } from "@babylonjs/core/Engines/engine";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { StringLine } from "../builder/stringLine";
import { EventBus } from "../event/eventBus";
import { ScreenshotTools } from "@babylonjs/core/misc/screenshotTools";
import { Tools } from "@babylonjs/core/misc/tools";

export function initScene(state) {
    state.bus.subscribe(EVENTS.CLEAR_DO, () => {
        location.reload();
    });

    state.bus.subscribe(EVENTS.SCREENSHOT_SAVE, () => {
        ScreenshotTools.CreateScreenshotAsync(
            state.engine,
            state.scene.activeCamera,
            { precision: 2 }            
        )
        .then(screenshotData => {            
            const tab = window.open();
            let img = tab.document.createElement("img");
            img.src = screenshotData;
            tab.document.title = 'Screenshot'; 
            tab.document.body.appendChild(img);
        })
        .catch(err => {
            console.log("there was an error capturing the screen shot");   
            console.log("err");
        })
    });
}

export function initState(state) {
    state.bus = new EventBus();
    state.engine = new Engine(state.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });
    state.scene = createOutlineScene(state.engine, {
        stencil: true,
    });
    state.adt = new AdvancedDynamicTexture.CreateFullscreenUI(
        "UI",
        true,
        state.scene
    );
    state.camera = createCamera(state.canvas, state.scene);
    state.utilityLayer = new UtilityLayerRenderer(state.scene);
    state.shadowGenerator = new ShadowGenerator(
        2048,
        state.scene.getLightByName("sun")
    );
    state.groundLevel = new GroundLevel();
    // state.shadowGenerator.usePoissonSampling = true;
    state.shadowGenerator.usePercentageCloserFiltering = true;
    state.outline = new StringLine(state, state.adt, false, state.bus);
    state.url = "http://localhost:3000";
    state.selected = null; // selected model
}
