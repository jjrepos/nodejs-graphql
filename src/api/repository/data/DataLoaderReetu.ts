//import { getClassForDocument } from "@typegoose/typegoose";
import { plainToClass } from "class-transformer";
//import { Document } from "mongoose";
import { Facility, FacilityModel } from "../../model/Facility";

//import { TransportationType, TransportationTypeModel } from "../../model/TransportationType";
//import { AmenityType, AmenityTypeModel } from "../../model/AmenityType";

//import { OperationType, OperationTypeModel } from "../../model/OperationType";
//import { SpaceType, SpaceTypeModel } from "../../model/SpaceType";

import facilites from "./facilites-data.json";




export class DataLoader {
    loadFaclilitesData(): Facility[] {
        return plainToClass(Facility, facilites);
    }



    async seedDatabase(): Promise<void> {
        //this.dropCollections();

       /* this.dropCollections().then(() => {
            Promise.all([TransportationTypeModel.create(this.loadTransportationTypes()),OperationTypeModel.create(this.loadOperationTypes()),
            FacilityModel.create(this.loadFaclilitesData())]).then(() => {
                //this.loadTransportations();
                //this.loadAmenities();
                this.loadOperations();
               // this.loadSpaces();
               this.loadNotifications();
            });
        });
*/
        
       /* this.dropCollections().then(() => {
            Promise.all([
            FacilityModel.create(this.loadFaclilitesData())])
        });
*/

        await this.dropCollections();
          
        FacilityModel.create(this.loadFaclilitesData());
    
        
    }

  

    

    
    private async dropCollections(): Promise<void> {
       await FacilityModel.collection.conn.dropCollection("facilities");
        
        
    }

    
}