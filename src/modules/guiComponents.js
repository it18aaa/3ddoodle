import $ from "jquery";

export function button(id, text, container = "button-container") {
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);
}

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


