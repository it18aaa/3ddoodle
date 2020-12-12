import { EVENTS } from "../event/types";

export function initGrowthController(state) {
    // setup our space

    state.scene.metadata.dynamicModels = [];
    state.scene.metadata.dynamicModelData = [];

    state.bus.subscribe(EVENTS.AGE_CHANGE, (age) => {
        const names = state.scene.metadata.dynamicModels;
        const modelData = state.scene.metadata.dynamicModelData;

        if (names.length > 0) {
            names.forEach((name) => {
                const mesh = state.scene.getMeshByName(name);
                // let model = mesh.metadata.model;
                // get our growth model data 
                let model = modelData[modelData.findIndex(a => a.name == name)].data;                

                // work out the scale of the tree given data & age...
                mesh.scalingDeterminant = getScalingDeterminant(
                    model.hstart,
                    model.hend,
                    model.years,
                    model.base,
                    age
                );
                // make sure tree is re-rendered
                mesh.markAsDirty();
            });
        }
        console.log("growth names; ", names)
        console.log("data; ", modelData)
    });
}

function getScalingDeterminant(startHeight, endHeight, growthYears, base, age) {
    // func to get log of any base
    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    const ratio = endHeight / startHeight;
    // start = base;
    const end = Math.pow(base, ratio);

    let scalingDeterminant = 1;

    if (age <= growthYears) {
        let x = base - (age / growthYears) * base + (age / growthYears) * end;
        scalingDeterminant = getBaseLog(base, x);
    } else {
        scalingDeterminant = ratio;
    }
    return scalingDeterminant;
}

function simulateGrowthOld(state, age) {
    // for each plant in state.plants
    // scale determinant

    // so for each plant we need to store - start height, end height, growth years.. from which
    // we can calculate a scale determinant, using a logarithmic regression

    // size is current scale  ... so tree is 2m   end scale is 10m   time .. 50m
    //  end / start    = scale determinant at start is 1
    // scale determinant @ end  is end / start e .g  10 m tree that starts at 2m .. is 5m
    // over 50 years
    const testtree = state.scene.getMeshByName("Pine.1.0");
    const endHeight = 12;
    const startHeight = 2;
    const growthYears = 80;
    const base = 1.4;

    const ratio = endHeight / startHeight;

    const start = base; // log(base) is 1
    const end = Math.pow(base, ratio); //

    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    if (age <= growthYears) {
        let x = base - (age / growthYears) * base + (age / growthYears) * end;
        // console.log(`${Math.log2(x)}`);
        // testtree.scalingDeterminant = Math.log2(x);
        testtree.scalingDeterminant = getBaseLog(base, x);
    } else {
        testtree.scalingDeterminant = ratio;
    }

    // console.log("Scaling determinant", testtree.scalingDeterminant)
    testtree.markAsDirty();
}
