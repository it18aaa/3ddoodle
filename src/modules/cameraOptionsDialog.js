
import { Dialog } from './dialog';
import { EVENTS } from "./constants";
import { getButton } from "./guiComponents"
import $ from "jquery";

export class CameraOptionsDialog extends Dialog {
    

    constructor(id, title, eventBus) {             
        super(id, title, eventBus);    
        
        // // this doesn't work in here, needs to be called from elsewhere
        // this.oid = `btn${this.id}ortho`;
        // this.pid = `btn${this.id}persp`;      

    }    

    contents() {
        var content = '';
        // this.boo();
        this.oid = `btn${this.id}ortho`;
        this.pid = `btn${this.id}persp`;

        // content += `Change View type<br />`;
        content += getButton(this.pid, 'Perspective View');
        content += getButton(this.oid, 'Orthographic View');
                        
        return content;
    }

    callbacks() {
        $(`#${this.oid}`).on('click', ()=> {            
            this.bus.dispatch(EVENTS.GUI_CAMERA_ORTHO)
        })

        $(`#${this.pid}`).on('click', ()=> {                        
            this.bus.dispatch(EVENTS.GUI_CAMERA_PERSPECTIVE)
        })
    }
}
