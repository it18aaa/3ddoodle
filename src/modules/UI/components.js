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
