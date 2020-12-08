import { EVENTS } from "../event/types";

export function initGrowthController(state) {
    state.bus.subscribe(EVENTS.AGE_CHANGE, (age) => {
        simulateGrowth(state, age);
    });
}

function simulateGrowth(state, age) {
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
        let x =   (base-(age/growthYears)*base)  + age/growthYears*end;
        // console.log(`${Math.log2(x)}`);
        // testtree.scalingDeterminant = Math.log2(x);
        testtree.scalingDeterminant = getBaseLog(base, x);
    } else {
        testtree.scalingDeterminant = ratio;
    }

    // console.log("Scaling determinant", testtree.scalingDeterminant)
    testtree.markAsDirty();
}
