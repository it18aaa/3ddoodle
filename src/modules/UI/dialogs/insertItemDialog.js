import { Dialog } from "./dialog";
import $ from "jquery";

export class InsertItemDialog extends Dialog {
    constructor(id, title, eventBus) {
        super(id, title, eventBus);
        // class fields don't work ...
    }

    // update data in the rendered dialog
    update(data) {        
        let content = '';
        
        // get list of meshes
        // and update this dialog with it
        console.log("fetching data")

        fetch('https://picsum.photos/v2/list')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    content += this.drawItem(item);
                    content += `<hr />`;
                });
            })
            .then(()=> {
                // rendering content                
                $(`#${this.id}list`).html(content);
            })
    }

    // override the parents contents method
    // this is rendered once, render placeholders here
    // and use update method 
    contents() {

        // resizet he dialog
        console.log(`rendering ${this.id}`)
        

        let content = '';            

        content = `
        <div id='${this.id}list' class="scrollable"> 
        </div>`;
        return content;
    }

    drawItem(item) {
        let content = '';
        content = `
        <div id=${item.id}>
        <input type="radio" id="${this.id}rad" value="${item.id}">            
            ${item.author}</input> <br />
            ${item.width} <br />
            ${item.url}<br />
            ${item.download_url} <br />            
        </div>`;
        return content;
    }

    callbacks() {
        //   super.callbacks();
    }

    accept() {
        const acceptedid = $(`#${this.id}rad:checked`).val()
        console.log(`inserting a mesh ${acceptedid}`)
        // load up accepted id by means of the event bus!
        // eg this.bus.dispatch(EVENTS.LOAD_MESH, { url : acceptedid })
        super.accept();
    }
}