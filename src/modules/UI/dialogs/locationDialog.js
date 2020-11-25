import { Dialog } from "./dialog";
import $ from "jquery";
import { EVENTS } from "../../event/types";

export class LocationDialog extends Dialog {
    lookupurl = "http://api.postcodes.io/postcodes/";
    lat = 53.411815;
    long = -2.98153;

    constructor(id, title, bus) {
        super(id, title, bus);
        // reminder class fields don't work here !
    }

    update(data) {
        this.data = data;
        $(`#${this.id}name`).text(`${this.data.name}`);
    }

    contents() {
        return `Set your location. <br /><br/>

        <label for='${this.id}postcode'>Lookup location from postcode
        <input type='text' id='${this.id}postcode' />
        <input id='${this.id}lookup' type='button' value='lookup'>
        </label>        
        <br /><br />  
        <label for='${this.id}lat' />Latitude: 
        <input type='text' id='${this.id}lat' value="${this.lat}"/>
        </label>
        <label for='${this.id}lat' />Longitude:
        <input type='text' id='${this.id}long' value="${this.long}"/>         
        </label>
    
      
        `;
    }

    callbacks() {
        $(`#${this.id}lookup`).on("click", (event) => {
            const postcode = $(`#${this.id}postcode`).val();
            
            //TODO: validation on postcode 

            // use the postcode api to extra long and lat
            fetch(`${this.lookupurl}${postcode}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        $(`#${this.id}lat`).val(data.result.latitude);
                        $(`#${this.id}long`).val(data.result.longitude);
                    } else {
                     // feedback about unknown postcode?   
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        });
    }

    accept() {
        const lat =   parseFloat($(`#${this.id}lat`).val());
        const long = parseFloat($(`#${this.id}long`).val());

        this.bus.dispatch(EVENTS.LOCATION_SET, { lat: lat, long: long });
        super.accept();
    }
}
