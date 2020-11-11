import {
    Dialog
} from "./dialog";
import {
    EVENTS
} from '../../event/types';
import $ from "jquery";

export class CreateFenceDialog extends Dialog {
    constructor(id, title, eventBus) {
        super(id, title, eventBus);
        // remember class fields don't work ...
    }

    // update data in the rendered dialog
    update(data) {
        let content = '';
        // let content = `<div id='${this.id}selection'>`;

        fetch('http://localhost:3000/api/fences')
            .then(response => response.json())
            .then(res => {
                console.log(res);
                this.data = res.data;

                res.data.forEach(item => {
                    // console.log(item)
                    content += this.drawItem(item);
                })
            })
            .then(() => {
                $(`#${this.id}list`).html(content);
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }

    // override the parents contents method
    // this is rendered once, render placeholders here
    // and use update method 
    contents() {
        // resize the dialog?
        let content = '';

        content = `
        <div id='${this.id}list' class="scrollable"> 
        </div>
        <div id='${this.id}height-slider-div'> 
        Height: <span id='${this.id}height-text'>1</span>m <br />
        <input id='${this.id}height-slider' type='range' value='1' min='0.2' max='4' step='0.1'>
        </div>        
        `;

        return content;
    }

    drawItem(item) {
        let content = '';
        // if we've clicked on an item, it is selected, so its id will be here to see
        const selected = this.selected && this.selected.id == item.id ? 'insert-item-thumb-selected' : '';

        content = `
        <div id=${item.id} class="insert-item-thumb ${selected}" name='${item.id}'>    
        <img src='http://localhost:3000${item.thumb}' alt='${item.name}' width='100' height='100' name='${item.id}'/>
           <div name='${item.id}'><span class='thumb-caption' name='${item.id}'>${item.name}</span></div>
           
        </div>`;

        return content;
    }

    callbacks() {
        
        // when click on list grab the selected object
        $(`#${this.id}list`).on('click', (ev) => {
            // console.log(ev.target.name);

            if (ev.target.name) {
                const selected = this.data.find(a => a.id == ev.target.name);
                if (selected) {
                    this.selected = selected;
                }
            }
            // need a re-render to show the selected item
            this.update(null);
        })

        // when the height slider changes, update the height labale
        $(`#${this.id}height-slider`).on('input', (ev) => {
            $(`#${this.id}height-text`).text(ev.target.value);
        });
    }

    // what to do when the okay button is pressed
    accept() {

        // put the height into the seleceted object
        if (this.selected) {
            this.selected.height = $(`#${this.id}height-slider`).val();
        }

        // ask the event bus to create a fence, with the fence details
        this.bus.dispatch(EVENTS.CREATE_FENCE, {
            fence: this.selected
        });

        // then any other business by the parent
        super.accept();
    }
}