///  date time and location change handler
// this controls where shadows are cast
import {
    EVENTS
} from "../event/types";
import * as SunCalc from "suncalc";
import {
    Vector3,
    Matrix,
    Axis
} from "@babylonjs/core/Maths/math";


export function initSunController(state) {

    // set some defaults
    state.location = {
        lat: 53.411815,
        long: -2.98153
    };
    state.time = {
        hour: 12,
        min: 0
    };    
    state.date = new Date("2020-06-06");

    state.sunOffset = Math.PI/2 // for some reason sun is 90degrees cw out

    


    state.bus.subscribe(EVENTS.LOCATION_SET, (location) => {
        state.location = location;
        updateDateAndLocation(state);        
        updateSunLight(state);
    });

    state.bus.subscribe(EVENTS.TIME_SET, (time) => {
        state.time = time;
        updateDateAndLocation(state);
        updateSunLight(state);
        
    });

    state.bus.subscribe(EVENTS.DATE_SET, (date) => {
        state.date = date;
        updateDateAndLocation(state);
        updateSunLight(state);        
    });
}

function updateDateAndLocation(state) {
    state.dateTime = new Date(state.date.getTime())
    state.dateTime.setHours(state.time.hour, state.time.min);
}

function updateSunLight(state) {

    const light = getSunlightVector(
        state.dateTime,
        state.location.lat,
        state.location.long,
        state.sunOffset);

    const sun = state.scene.getLightByName("sun");
    const skyMaterial = state.scene.getMaterialByName("skyMaterial");
    
    // change direction vector of directional light 
    sun.direction = light.lightDir;
    // position in sky in appropriate place
    sun.position = light.sunDir.scale(35);

    if(state.dateTime.getTime() < light.times.sunrise || state.dateTime.getTime() > light.times.sunset) {
        sun.setEnabled(false);        
    } else {
        sun.setEnabled(true);        
    }
    
    // update the skybox material
    skyMaterial.sunPosition = light.sunDir.scale(100);  

}


export function getSunlightVector(date, lat, lon, offset) {

    // SUNCALC NOTES
    //  angles in radians
    // azimuth angle cw rot around y axis
    //  angle 0 is south, or -z, angle 3/4*PI is NW
    // elevation angle called 'altitude', from ZX plane
    
    // get 2 angles output.azimuth & output.altitude
    const output = SunCalc.getPosition(date, lat, lon); 
    const times = SunCalc.getTimes(date, lat, lon);

    // a vector pointing southward
    const south = new Vector3(0, 0, -1);

    // get Azimuth vector

    

    // matrix to rotate the vector to the azimuth angle
    const azimuthMatrix = Matrix.RotationAxis(Axis.Y, output.azimuth + offset);
    // apply matrix and get azimuth vector
    const azimuthVector = Vector3.TransformCoordinates(south, azimuthMatrix);


    // get azimuth's new X axis

    // matrix to rotate the azimuth 90 degree, or Pi/2 Radians anti-clockwise
    // to get its x-axis
    const azimuthAxisMatrix = Matrix.RotationAxis(Axis.Y, -Math.PI / 2);

    // apply the matrix and get the x axis
    const azimuthXAxis = Vector3.TransformCoordinates(azimuthVector, azimuthAxisMatrix);


    // rotate by elevation using new X axis

    // matrix to pitch up/down to the suns position in sky
    const elevationMatrix = Matrix.RotationAxis(azimuthXAxis, output.altitude);
    // apply the transform
    const sunDirVector = Vector3.TransformCoordinates(azimuthVector, elevationMatrix);

    // invert the vector, this is the direction of sunlight
    const lightDirVector = new Vector3(sunDirVector.x * -1, sunDirVector.y * -1, sunDirVector.z * -1);

    return {
        times: times,
        sunDir: sunDirVector,
        lightDir: lightDirVector,
        azimuth: output.azimuth,
        altitude: output.altitude
    };

}