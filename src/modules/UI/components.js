import { EVENTS } from "../event/types";
import $ from "jquery";

export function button(id, text, container = "button-container") {
  $(`.${container}`).append(`<button id='${id}'>${text}</button>`);
}

export function button2(
  id,
  text,
  event,
  callback,
  container = "button-container"
) {
  // render the button
  $(`.${container}`).append(`<button id='${id}'>${text}</button>`);

  // attach the callback
  $(`#${id}`).on("click", callback);
}

export function getButton(id, text) {
  return `<button id='${id}'>${text}</button>`;
}

// TODO: remove hardcoded styles...
export function getTextField(id, label, def = "") {
  let output = `<div style='border: 1px solid grey'>`;
  output += `${label}: <br />`;
  output += `<input type='text' id='${id}'>${def}</input>`;
  output += `</div>`;
  return output;
}

// TODO: this isn't very good, needs refactoring
export function rangeSlider(
  id,
  text,
  min = 0,
  max = 10,
  step = 1,
  container = "button-container",
  value = 5
) {
  $(`.${container}`).append(
    `<input id='${id}' type='range' min=${min} max=${max} step=${step}>${text}</input>`
  );
}


// not used...
export function datePicker(id, text, callback, container = "button-container") {
  let content = `

  <label for="${id}">${text}</label>
  <input type="date" id="${id}" name="${text} value="/>  
  `;

  // render the content
  $(`.${container}`).append(content);

  // callback
  $(`#${id}`).on("input", (event) => {

    // component specific stuff here
    callback(event);
  });
}



export function dateSlider(id, text, callback, container = "button-container") {
  const defaultDay = 10;
  const d = dateFromNumber(defaultDay);
  const dateString = d.toLocaleDateString('en-GB',
    {
      day: 'numeric',
      month: 'long'
    });

  let content = `<div class='slider'>
    <label for='${id}'>
    ${text}</label>
    <input id='${id}' type='range' min=1 max=366 step=1 value=${defaultDay} />
    <label for='${id}'><span id='${id}date'>${dateString}</label>
    </div>
    
    `;

  // render the content
  $(`.${container}`).append(content);

  // callback on slider change
  $(`#${id}`).on("input", (event) => {

    // change the label accordingling
    let d = dateFromNumber(event.target.value);
    let dateString = d.toLocaleDateString('en-GB',
      {
        day: 'numeric',
        month: 'short'
      });

    $(`#${id}date`).text(dateString);
   
      //  
    callback(dateFromNumber(event.target.value));
  });

  // helper function...
  function dateFromNumber(dayNumber) {
    // take a leap year
    const startOfleapYear = new Date(2020, 0);
    // get date when we add on number of days
    return new Date(startOfleapYear.setDate(dayNumber));
  }
}



export function timeSlider(id, text, callback, container = "button-container") {
  const defaultTime = 720;
  const time = getTimeFromMins(defaultTime);

  let content = `  
  <div class='slider'>
    <label for='${id}'>${text} </label>
      <input id='${id}' type='range' min=0 max=1440 step=1 value=${defaultTime}/>
    <label for='${id}'>
    <span id='${id}timetext'>${getTimeString(time.hour, time.min)}</span>
    </label>  
    </div>
  `;

  // render the content
  $(`.${container}`).append(content);

  // attach the callback that
  // updates label and fires off
  // callback
  $(`#${id}`).on("input", (event) => {

    // change label and fire off callback
    let time = getTimeFromMins(event.target.value)

    $(`#${id}timetext`).text(getTimeString(time.hour, time.min));

    callback(time);
  });

  // helper function to create string
  function getTimeString(hour, min) {
    let t = hour.toString().padStart(2, "0") +
      ":" +
      min.toString().padStart(2, "0");
    return t;
  }

  function getTimeFromMins(time) {
    return {
      hour: Math.floor(time / 60),
      min: time % 60
    }
  }
}
