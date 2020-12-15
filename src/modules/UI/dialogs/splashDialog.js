import { Dialog } from "./dialog";

export class SplashDialog extends Dialog {    
    
    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
        this.instructions = "./help.html"
    }
    
    contents() {
        return `        
        <h1>3D Garden Designer</h1>
        
        <div style='text-align: center'><img src='./img/splash.jpg'></img>
        </div><div>
        For instructions please visit
        <a href="${this.instructions}">here</a>
        </div>
        
        <div style='text-align: right' >Close this dialog to continue...
        </div>
        
        `;
    }

}
