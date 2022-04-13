import { getClassForDocument } from "@typegoose/typegoose";
import { plainToClass } from "class-transformer";
import { Document } from "mongoose";
import { Facility, FacilityModel } from "../../model/Facility";
import { Transportation, TransportationModel } from "../../model/Transportation";
import { TransportationType, TransportationTypeModel } from "../../model/TransportationType";
import { AmenityType, AmenityTypeModel } from "../../model/AmenityType";
import { Amenity, AmenityModel } from "../../model/Amenity";
import { Operation, OperationModel } from "../../model/Operation";
import { OperationType, OperationTypeModel } from "../../model/OperationType";
import { SpaceType, SpaceTypeModel } from "../../model/SpaceType";
import { Space, SpaceModel } from "../../model/Space";
import { Notification, NotificationModel } from "../../model/Notification";

import facilites from "./facilites-data.json";
import transportationTypes from "./transportation-types.json";
import transportationData from "./transportation.json";
import amenityTypes from "./amenity-types.json";
import amenitiesData from "./amenities.json";
import operationTypes from "./operation-types.json";
import operationData from "./operation.json";
import spaceTypes from "./space-types.json";
import spaceData from "./spaces.json";
import notificationData from "./notifications.json";


export class DataLoader {
    loadFaclilitesData(): Facility[] {
        return plainToClass(Facility, facilites);
    }

    loadTransportationTypes(): TransportationType[] {
        return plainToClass(TransportationType, transportationTypes);
    }

    loadAmenityTypes(): AmenityType[] {
        return plainToClass(AmenityType, amenityTypes);
    }

    loadOperationTypes(): OperationType[] {
        return plainToClass(OperationType, operationTypes);
    }

    loadSpaceTypes(): SpaceType[] {
        return plainToClass(SpaceType, spaceTypes);
    }


    async seedDatabase(): Promise<void> {
        //this.dropCollections();

        this.dropCollections().then(() => {
            Promise.all([TransportationTypeModel.create(this.loadTransportationTypes()),OperationTypeModel.create(this.loadOperationTypes()),
            FacilityModel.create(this.loadFaclilitesData()), AmenityTypeModel.create(this.loadAmenityTypes()), SpaceTypeModel.create(this.loadSpaceTypes())]).then(() => {
                this.loadTransportations();
                this.loadAmenities();
                this.loadOperations();
                this.loadSpaces();
                this.loadNotifications();
            });
        }); 
    }

    
    private async loadTransportations() {
        let parkingPromise: Promise<Document | null> = TransportationTypeModel.findOne({ name: "PARKING" }).exec();
        let visitorPromise: Promise<Document | null> = TransportationTypeModel.findOne({ name: "VISITOR_PARKING" }).exec();
        let metroPromise: Promise<Document | null> = TransportationTypeModel.findOne({ name: "METRO" }).exec();
        let busPromise: Promise<Document | null> = TransportationTypeModel.findOne({ name: "BUS" }).exec();
        let shuttlePromise: Promise<Document | null> = TransportationTypeModel.findOne({ name: "SHUTTLE" }).exec();
        let cystalCityPromise: Promise<Document | null> = FacilityModel.findById("CRYS").exec();
        let washingtonPromise: Promise<Document | null> = FacilityModel.findById("WADC").exec();
        let hamiltonPromise: Promise<Document | null> = FacilityModel.findById("HMLT").exec();
        let bethesdaPromise: Promise<Document | null> = FacilityModel.findById("BETH").exec();
        let boozPromise: Promise<Document | null> = FacilityModel.findById("BOOZ").exec();
        let herndonPromise: Promise<Document | null> = FacilityModel.findById("HDPW").exec();
        let dcPromise: Promise<Document | null> = FacilityModel.findById("WASH").exec();

        Promise.all([parkingPromise, visitorPromise, metroPromise, busPromise, shuttlePromise, cystalCityPromise, washingtonPromise, hamiltonPromise, bethesdaPromise, boozPromise, herndonPromise, dcPromise])
            .then(([parkingDoc, visitorDoc, metroDoc, busDoc, shuttleDoc, crystalDoc, collegePDock, hamiltonDoc, bethesdaDoc, boozDoc, herndonDoc, dcDoc]) => {
                let parking: TransportationType = this.convertDocument(parkingDoc);
                let visitorParking: TransportationType = this.convertDocument(visitorDoc);
                let metro: TransportationType = this.convertDocument(metroDoc);
                let bus: TransportationType = this.convertDocument(busDoc);
                let shuttle: TransportationType = this.convertDocument(shuttleDoc);
                let crystalCity: Facility = this.convertDocument(crystalDoc);
                let washington: Facility = this.convertDocument(collegePDock);
                let hamilton: Facility = this.convertDocument(hamiltonDoc);
                let bethesda: Facility = this.convertDocument(bethesdaDoc);
                let booz: Facility = this.convertDocument(boozDoc);
                let herndon: Facility = this.convertDocument(herndonDoc);
                let dc: Facility = this.convertDocument(dcDoc);

                let transportations: Transportation[] = plainToClass(Transportation, transportationData);
                transportations[0].facility = crystalCity;
                transportations[0].type = parking;
                transportations[0].address = crystalCity.address;
                transportations[1].facility = crystalCity;
                transportations[1].type = visitorParking;
                transportations[1].address = crystalCity.address;
                transportations[2].facility = washington;
                transportations[2].type = parking;
                transportations[2].address = washington.address;
                transportations[3].facility = hamilton;
                transportations[3].type = parking;
                transportations[3].address = hamilton.address;
                transportations[4].facility = hamilton;
                transportations[4].type = metro;
                transportations[4].address = hamilton.address;
                transportations[5].facility = hamilton;
                transportations[5].type = bus;
                transportations[5].address = hamilton.address;
                transportations[6].facility = hamilton;
                transportations[6].type = shuttle;
                transportations[6].address = hamilton.address;
                transportations[7].facility = bethesda;
                transportations[7].type = metro;
                transportations[7].address = bethesda.address;
                transportations[8].facility = booz;
                transportations[8].type = parking;
                transportations[8].address = booz.address;
                transportations[9].facility = booz;
                transportations[9].type = metro;
                transportations[9].address = booz.address;
                transportations[10].facility = booz;
                transportations[10].type = bus;
                transportations[10].address = booz.address;
                transportations[11].facility = booz;
                transportations[11].type = shuttle;
                transportations[11].address = booz.address;
                transportations[12].facility = herndon;
                transportations[12].type = parking;
                transportations[12].address = herndon.address;
                transportations[13].facility = herndon;
                transportations[13].type = shuttle;
                transportations[13].address = herndon.address;
                transportations[14].facility = dc;
                transportations[14].type = shuttle;
                transportations[14].address = dc.address;
                TransportationModel.create(transportations);
            });
    }

    private async loadAmenities() {
        let bikeRackPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "BIKE_RACK" }).exec();
        let EVCSPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "ELECTRIC_VEHICLE_CHARGING_STATION" }).exec();
        let fitnessCenterPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "FITNESS_CENTER" }).exec();
        let foodServicesPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "FOOD_SERVICES" }).exec();
        let mothersRoomPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "MOTHERS_ROOM" }).exec();
        let quietRoomPromise: Promise<Document | null> = AmenityTypeModel.findOne({ name: "QUIET_ROOM" }).exec();

        let hamiltonPromise: Promise<Document | null> = FacilityModel.findById("HMLT").exec();

        Promise.all([bikeRackPromise, EVCSPromise, fitnessCenterPromise, foodServicesPromise, mothersRoomPromise, quietRoomPromise, hamiltonPromise])
            .then(([bikeRackDoc, EVCSDoc, fitnessCenterDoc, foodServicesDoc, mothersRoomDoc, quietRoomDoc, hamiltonDoc]) => {
                let bikeRack: AmenityType = this.convertDocument(bikeRackDoc);
                let EVCS: AmenityType = this.convertDocument(EVCSDoc);
                let fitnessCenter: AmenityType = this.convertDocument(fitnessCenterDoc);
                let foodServices: AmenityType = this.convertDocument(foodServicesDoc);
                let mothersRoom: AmenityType = this.convertDocument(mothersRoomDoc);
                let quietRoom: AmenityType = this.convertDocument(quietRoomDoc);

                let hamilton: Facility = this.convertDocument(hamiltonDoc);

                let amenities: Amenity[] = plainToClass(Amenity, amenitiesData);
                amenities[0].facility = hamilton;
                amenities[0].type = bikeRack;
                amenities[1].facility = hamilton;
                amenities[1].type = EVCS;
                amenities[2].facility = hamilton;
                amenities[2].type = fitnessCenter;
                amenities[3].facility = hamilton;
                amenities[3].type = foodServices;
                amenities[4].facility = hamilton;
                amenities[4].type = foodServices;
                amenities[5].facility = hamilton;
                amenities[5].type = mothersRoom;
                amenities[6].facility = hamilton;
                amenities[6].type = quietRoom;
                
                AmenityModel.create(amenities);
            });
    }

    private async loadOperations() {
        let distributionDoc: Document | null = await OperationTypeModel.findOne({ name: "DISTRIBUTION_SERVICE" }).exec();
        let cleaningDoc: Document | null = await OperationTypeModel.findOne({ name: "CLEANING_SERVICE" }).exec();
        let conciergeDoc: Document | null = await OperationTypeModel.findOne({ name: "CONCIERGE_SERVICE" }).exec();
        let receptionDoc: Document | null = await OperationTypeModel.findOne({ name: "RECEPTION_SERVICE" }).exec();
        let recycleDoc: Document | null = await OperationTypeModel.findOne({ name: "RECYCLING_SERVICE" }).exec();
        let accessControlDoc: Document | null = await OperationTypeModel.findOne({ name: "ACCESS_CONTROL_OFFICE_SERVICE" }).exec();
        let greenOfficeDoc: Document | null = await OperationTypeModel.findOne({ name: "GREEN_OFFICE_TEAM_SERVICE" }).exec();
        let facilityMangementDoc: Document | null = await OperationTypeModel.findOne({ name: "FACILITY_MANAGEMENT_SERVICE" }).exec();
        
        let herndonDoc: Document | null = await FacilityModel.findById("HDPW").exec();

        let distribution: OperationType = this.convertDocument(distributionDoc);
        let cleaning: OperationType = this.convertDocument(cleaningDoc);
        let concierge: OperationType = this.convertDocument(conciergeDoc);
        let reception: OperationType = this.convertDocument(receptionDoc);
        let recycle: OperationType = this.convertDocument(recycleDoc);
        let accessControl: OperationType = this.convertDocument(accessControlDoc);
        let greenOffice: OperationType = this.convertDocument(greenOfficeDoc);
        let facilityMangement: OperationType = this.convertDocument(facilityMangementDoc);
        
        let herndon: Facility = this.convertDocument(herndonDoc);

        let operations: Operation[] = plainToClass(Operation, operationData);
        operations[0].facility = herndon;
        operations[0].type = concierge;
        operations[1].facility = herndon;
        operations[1].type = reception;
        operations[2].facility = herndon;
        operations[2].type = cleaning;
        operations[3].facility = herndon;
        operations[3].type = recycle;
        operations[4].facility = herndon;
        operations[4].type = accessControl;
        operations[5].facility = herndon;
        operations[5].type = greenOffice;
        operations[6].facility = herndon;
        operations[6].type = facilityMangement;
        operations[7].facility = herndon;
        operations[7].type = distribution;

        OperationModel.create(operations);
        
    }

    private async loadSpaces() {
        let collaborationRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "COLLABORATION_ROOM" }).exec();
        let teamRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "TEAM_ROOM" }).exec();
        let huddleRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "HUDDLE_ROOM" }).exec();
        let conferenceRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "CONFERENCE_ROOM" }).exec();
        let partnerConferenceRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "PARTNER_CONFERENCE_ROOM" }).exec();
        let boardRoomPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "BOARD_ROOM" }).exec();
        let otherSpacesPromise: Promise<Document | null> = SpaceTypeModel.findOne({ name: "OTHER_SPACES" }).exec();

        let hamiltonPromise: Promise<Document | null> = FacilityModel.findById("HMLT").exec();
        let boozPromise: Promise<Document | null> = FacilityModel.findById("BOOZ").exec();
        let bethPromise: Promise<Document | null> = FacilityModel.findById("BETH").exec();

        Promise.all([collaborationRoomPromise, teamRoomPromise, huddleRoomPromise, conferenceRoomPromise,
            partnerConferenceRoomPromise, boardRoomPromise, otherSpacesPromise, 
            hamiltonPromise, boozPromise, bethPromise])
            .then(([collaborationRoomDoc, teamRoomDoc, huddleRoomDoc, conferenceRoomDoc,
                partnerConferenceRoomDoc, boardRoomDoc, otherSpacesDoc, 
                hamiltonDoc, boozDoc, bethDoc]) => {
                let collaborationRoom: SpaceType = this.convertDocument(collaborationRoomDoc);
                let teamRoom: SpaceType = this.convertDocument(teamRoomDoc);
                let huddleRoom: SpaceType = this.convertDocument(huddleRoomDoc);
                let conferenceRoom: SpaceType = this.convertDocument(conferenceRoomDoc);
                let partnerConferenceRoom: SpaceType = this.convertDocument(partnerConferenceRoomDoc);
                let boardRoom: SpaceType = this.convertDocument(boardRoomDoc);
                let otherSpaces: SpaceType = this.convertDocument(otherSpacesDoc);

                let hamilton: Facility = this.convertDocument(hamiltonDoc);
                let booz: Facility = this.convertDocument(boozDoc);
                let beth: Facility = this.convertDocument(bethDoc);

                let spaces: Space[] = plainToClass(Space, spaceData);
                spaces[0].facility = beth;
                spaces[0].type = collaborationRoom;
                spaces[1].facility = beth;
                spaces[1].type = huddleRoom;
                spaces[2].facility = beth;
                spaces[2].type = conferenceRoom;
                spaces[3].facility = beth;
                spaces[3].type = partnerConferenceRoom;
                spaces[4].facility = beth;
                spaces[4].type = boardRoom;
                spaces[5].facility = beth;
                spaces[5].type = otherSpaces;
                spaces[6].facility = hamilton;
                spaces[6].type = teamRoom;
                spaces[7].facility = hamilton;
                spaces[7].type = collaborationRoom;
                spaces[8].facility = hamilton;
                spaces[8].type = conferenceRoom;
                spaces[9].facility = booz;
                spaces[9].type = teamRoom;
                spaces[10].facility = booz;
                spaces[10].type = collaborationRoom;
                spaces[11].facility = booz;
                spaces[11].type = conferenceRoom;
                
                SpaceModel.create(spaces);
            });
    }


    private async loadNotifications() {
        let boozDoc: Document | null = await FacilityModel.findById("BOOZ").exec();
        let booz: Facility = this.convertDocument(boozDoc);

        let notifications: Notification[] = plainToClass(Notification, notificationData);

        notifications[0].facility = booz;
        notifications[1].facility = booz;

        NotificationModel.create(notifications);

    }
    
    private async dropCollections(): Promise<void> {
       await FacilityModel.collection.conn.dropCollection("facilities");
       await TransportationModel.collection.conn.dropCollection("transportations");
        await TransportationTypeModel.collection.conn.dropCollection("transportationtypes");
        await AmenityTypeModel.collection.conn.dropCollection("amenitytypes");
        await AmenityModel.collection.conn.dropCollection("amenities");
        await OperationModel.collection.conn.dropCollection("operations");
        await OperationTypeModel.collection.conn.dropCollection("operationtypes");
        await SpaceTypeModel.collection.conn.dropCollection("spacetypes");
        await SpaceModel.collection.conn.dropCollection("spaces");
        await NotificationModel.collection.conn.dropCollection("notifications");
        
    }

    private convertDocument(doc: Document | null) {
        if (doc) {
            const convertedDocument = doc.toObject();
            const DocumentClass = getClassForDocument(doc)!;
            Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
            return convertedDocument;
        }
    }
}