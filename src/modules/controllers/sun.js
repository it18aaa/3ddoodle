///  date time and location change handler
// this controls where shadows are cast
import { EVENTS } from "../event/types";
import { suncalc } from "suncalc";
import { Vector3 } from "@babylonjs/core/Maths/math";

export function initSunController(state) {
    state.bus.subscribe(EVENTS.LOCATION_SET, (location) => {
        state.location = location;
        showSuncalcDetails(state);
    });

    state.bus.subscribe(EVENTS.TIME_SET, (time) => {
        state.time = time;
        showSuncalcDetails(state);
    });

    state.bus.subscribe(EVENTS.DATE_SET, (date) => {
        state.date = date;
        showSuncalcDetails(state);
    });
}

function showSuncalcDetails(state) {
    console.log(state.location);
    console.log(state.time);
    console.log(state.date);
    console.log(state.dateTime);
}

export function getSunlightVector(date, lat, lon) {
    vec = new Vector3(0, 0, 0);

    const dateTime = new Date();
}
