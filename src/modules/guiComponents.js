import $ from "jquery";

export function button(id, text, container = "button-container") {
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);
}

export function button2(id, text, event, callback, container = "button-container") {
    // render the button
    $(`.${container}`).append(`<button id='${id}'>${text}</button>`);

    
    // attach the callback
    $(`#${id}`).on('click', callback);
}


export class Dialog {
    title;
    id;
    hide = true;

    constructor(id, title) {
        console.log("inside the constructor of dialog!")
        this.id = id;
        this.title = title ? title : "blank dialog!";
        this.render();
    }   

    render() {
        $('body').append(`<div class='modal' id='${this.id}'>${this.title}</div>`);
    }
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


