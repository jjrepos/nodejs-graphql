import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { TransportationTypeService } from "../../src/api/service/TransportationTypeService";
import { blankType, metro, parking, transportationTypes, upgradeParking } from "../data/TransportationTypes";
import { TransportationTypeComparator } from "../util/TransportationTypeComparator";

import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { transportationsData } from "../data/Transportations";
import { facilities} from "../data/Facilities";

import { connection } from "mongoose";

const service: TransportationTypeService = new TransportationTypeService();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await TransportationTypeModel.create(transportationTypes);
    await FacilityModel.create(facilities);
    let parking: TransportationType | null = await TransportationTypeModel.findOne({ name: "PARKING" }).exec();
    let visitor: TransportationType | null = await TransportationTypeModel.findOne({ name: "VISITOR_PARKING" }).exec();
    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let transportations: Transportation[] = plainToClass(Transportation, transportationsData);
    transportations[0].facility = hamilton!;
    transportations[0].type = parking!;
    transportations[0].address = hamilton!.address;
    transportations[1].facility = hamilton!;
    transportations[1].type = visitor!;
    transportations[1].address = hamilton!.address;
    transportations[2].facility = booz!;
    transportations[2].type = parking!;
    transportations[2].address = booz!.address;
    await TransportationModel.create(transportations);
});

describe("TransportationType Service Tests", () => {
    it("Service should return transportation type given type name", async () => {
        const transportationType: TransportationType | null = await service.getTransportationType(parking.name);
        expect(transportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(transportationType!, parking);
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should return all transportation types", async () => {
        const transportationTypes: TransportationType[] | null = await service.getAllTransportationTypes();
        expect(transportationTypes).not.toBeNull();
        expect(transportationTypes).toHaveLength(2);
        TransportationTypeComparator.compareAllFields(transportationTypes[0], parking);
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should create a new transportation type", async () => {
        const transportationType: TransportationType | null = await service.save(metro);
        expect(transportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(transportationType, metro);
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should update an existing transportation type", async () => {
        const transportationType: TransportationType | null = await service.getTransportationType(parking.name);
        expect(transportationType).not.toBeNull();

        transportationType!.name = upgradeParking.name;
        transportationType!.desc = upgradeParking.desc;
        const updatedTransportationType = await service.update(transportationType!._id.toHexString(), transportationType!);
        expect(updatedTransportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(updatedTransportationType!, upgradeParking);

        const transportationTypes: TransportationType[] | null = await service.getAllTransportationTypes();
        expect(transportationTypes).not.toBeNull();
        expect(transportationTypes).toHaveLength(3);
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should delete a transportation type", async () => {
        const transportationType: TransportationType | null = await service.getTransportationType(metro.name);
        expect(transportationType).not.toBeNull();

        await service.delete(transportationType!._id.toString());
        const deletedTransportationType: TransportationType | null = await service.getTransportationType(parking.name);
        expect(deletedTransportationType).toBeNull();
    });
});

//all -ve test cases
describe("TransportationType Service Tests", () => {
    it("Service should error to delete a transportation type, transportation type should have associated transportations", async () => {
        const transportationType: TransportationType | null = await service.getTransportationType(upgradeParking.name);
        expect(transportationType).not.toBeNull();

        await expect(service.delete(transportationType!._id.toString())
        ).rejects.toThrowError("Cannot delete type - has associated transportations");
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should error to delete a transportation type, transportation type should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete transportation type 5f05d1474b5dcbb405111935. Transportation type not found.");
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should error to update a transportation type, transportation type should not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405111935", upgradeParking!) 
        ).rejects.toThrowError("Unable to update transportation type 5f05d1474b5dcbb405111935. Transportation type not found.");
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should error to save a transportation type, transportation type should already exist", async () => {
        await expect(service.save(upgradeParking)
        ).rejects.toThrowError("Transportation type already exists");
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should error to save a transportation type, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankType)
        ).rejects.toThrowError("name, desc should not contain blank spaces only.");
    });
});

describe("TransportationType Service Tests", () => {
    it("Service should not find transportation type, transportation type should not exist", async () => {
        const transportationType: TransportationType | null = await service.getTransportationType("WALKING");
        expect(transportationType).toBeNull();
    });
});