import {
    Dialog
} from "./dialog";
import { EVENTS } from '../../event/types';
import $ from "jquery";

export class InsertItemDialog extends Dialog {
    constructor(id, title, eventBus) {
        super(id, title, eventBus);
        // class fields don't work ...
    }

    // update data in the rendered dialog
    update(data) {
        let content='';
        // let content = `<div id='${this.id}selection'>`;

        fetch('http://localhost:3000/api/models')
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
                //close the selection div
                // content += `</div>`;
                // render content in place holder
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
        </div>`;
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

        //  ${item.notes}<br />
        // ${item.id}<br />
        // ${item.path}<br />            
    }

    callbacks() {
        //   super.callbacks();
        $(`#${this.id}list`).on('click', (ev) => {
            // console.log(ev.target.name);

            if(ev.target.name) {                
                const selected = this.data.find(a => a.id == ev.target.name);
                if(selected) {
                    this.selected = selected;
                }
            }
            // need a re-render to show the selected item
            this.update(null);
        })
    }

    accept() {
        
        // console.log(this.selected);
        // load up accepted id by means of the event bus!
        
        this.bus.dispatch(EVENTS.MODEL_ADD, {model : this.selected });
        super.accept();
    }
}