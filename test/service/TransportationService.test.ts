import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { TransportationService } from "../../src/api/service/TransportationService";
import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";
import { TransportationComparator } from "../util/TransportationComparator";

import { blankTransportationData, badHourshamiltonParkingTransportationData, toUpdatehamiltonMetroTransportationData, hamiltonMetroTransportationData, hamiltonParkingTransportationData, transportationsData, boozParkingTransportationData } from "../data/Transportations";
import { parking, transportationTypes, metro, visitorParking } from "../data/TransportationTypes";
import { facilities, hamilton, booz} from "../data/Facilities";
import { TransportationInput } from "../../src/api/resolver/types/input/TransportationInput";

import { connection } from "mongoose";
import { AddressInput } from "../../src/api/resolver/types/input/AddressInput";

const service: TransportationService = new TransportationService();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await TransportationTypeModel.create(transportationTypes);
    await TransportationTypeModel.create(metro);
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

describe("Transportation Service Tests", () => {
    it("Service should return transportations given facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] = await service.getAllTransportations(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFields(transportationResult[0], hamiltonTransportation, parking);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should return transportations with facility given facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] = await service.getAllTransportationsWithFacility(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFieldsWithFacility(transportationResult[0], hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should return transportations given type name and facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(parking.name, hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        TransportationComparator.compareAllFields(transportationResult![0], hamiltonTransportation, parking);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should return transportations with facility given type name and facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportationWithFacility(parking.name, hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        TransportationComparator.compareAllFieldsWithFacility(transportationResult![0], hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should return transportations given type name, facility id, address", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        let parking: TransportationType | null = await TransportationTypeModel.findOne({name:"PARKING"}).exec();
        expect(parking).not.toBeNull();

        const transportationResult: Transportation[] | null = await service.getTransportationWithTypeId(parking!._id.toString());
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFields(transportationResult![0], hamiltonTransportation, parking!);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should create a new transportation", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, hamiltonMetroTransportationData);
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonMetroTransportationData);
        const transportation: Transportation | null = await service.save(hamiltonTransportationInput);
        expect(transportation).not.toBeNull();
        TransportationComparator.compareAllFields(transportation, hamiltonTransportation, metro!);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should update an existing transportation", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, toUpdatehamiltonMetroTransportationData);
        let hamiltonTransportation: Transportation = plainToClass(Transportation, toUpdatehamiltonMetroTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(metro!.name, hamiltonTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        expect(transportationResult![0]).not.toBeNull();

        const updateResult: Transportation | null = await service.update(transportationResult![0]._id.toString(), hamiltonTransportationInput);
        expect(updateResult).not.toBeNull();
        TransportationComparator.compareAllFields(updateResult!, hamiltonTransportation, metro!);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should delete an existing transportation", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, toUpdatehamiltonMetroTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(metro!.name, hamiltonTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        
        const transportation: Boolean = await service.delete(transportationResult![0]._id.toString());
        expect(transportation).not.toBeNull();
        expect(transportation).toBe(true);

        const postDeleteTransportationResult: Transportation[] | null = await service.getTransportation(metro!.name, hamiltonTransportationInput.facility);
        expect(postDeleteTransportationResult).not.toBeNull();
        expect(postDeleteTransportationResult).toHaveLength(0);
    });
});

//all -ve test cases
describe("Transportation Service Tests", () => {
    it("Service should error to delete a transportation, transportation should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete transportation 5f05d1474b5dcbb405111935. Transportation not found.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to update a transportation, transportation should not exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, toUpdatehamiltonMetroTransportationData);
        await expect(service.update("5f05d1474b5dcbb405111935", hamiltonTransportationInput!) 
        ).rejects.toThrowError("Unable to update transportation 5f05d1474b5dcbb405111935. Transportation not found.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to update a transportation, operational hours should be incorrect", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, badHourshamiltonParkingTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(parking!.name, hamiltonTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        expect(transportationResult![0]).not.toBeNull();

        await expect(service.update(transportationResult![0]._id.toString(), hamiltonTransportationInput)
        ).rejects.toThrowError("Duplicate days found.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to update a transportation, transportation type should not exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, toUpdatehamiltonMetroTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(parking!.name, hamiltonTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        expect(transportationResult![0]).not.toBeNull();
        hamiltonTransportationInput.type = "WALKING";
        
        await expect(service.update(transportationResult![0]._id.toString(), hamiltonTransportationInput)
        ).rejects.toThrowError("TransportationType does not exist");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to update a transportation, facility should not exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, toUpdatehamiltonMetroTransportationData);
        const transportationResult: Transportation[] | null = await service.getTransportation(parking!.name, hamiltonTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        expect(transportationResult![0]).not.toBeNull();
        hamiltonTransportationInput.facility = "ZZZZ";
        
        await expect(service.update(transportationResult![0]._id.toString(), hamiltonTransportationInput)
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to update a transportation, transportation already exists", async () => {
        let boozTransportationInput: TransportationInput = plainToClass(TransportationInput, boozParkingTransportationData);
        boozTransportationInput.address = hamilton.address;
        boozTransportationInput.type = visitorParking.name;
        boozTransportationInput.facility = booz._id;
        const transportationResult: Transportation[] | null = await service.getTransportation(parking!.name, boozTransportationInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        expect(transportationResult![0]).not.toBeNull();
        boozTransportationInput.facility = hamilton._id;
        await expect(service.update(transportationResult![0]._id.toString(), boozTransportationInput)
        ).rejects.toThrowError("Transportation already exists");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to save a transportation, facility should not exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, hamiltonParkingTransportationData);
        await expect(service.save(hamiltonTransportationInput)
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to save a transportation, transportation should already exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, hamiltonParkingTransportationData);
        hamiltonTransportationInput.facility = hamilton._id!;
        hamiltonTransportationInput.type = parking.name;
        hamiltonTransportationInput.address = hamilton.address!;
        await expect(service.save(hamiltonTransportationInput)
        ).rejects.toThrowError("Transportation already exists");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to save a transportation, transportation type should not exist", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, hamiltonParkingTransportationData);
        hamiltonTransportationInput.facility = hamilton._id;
        hamiltonTransportationInput.type = "WALKING";
        await expect(service.save(hamiltonTransportationInput)
        ).rejects.toThrowError("TransportationType does not exist");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to save a transportation, operational hours should be incorrect", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, badHourshamiltonParkingTransportationData); 
        await expect(service.save(hamiltonTransportationInput)
        ).rejects.toThrowError("Duplicate days found.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should error to save a transportation, variables should not contain blank spaces only", async () => {
        let hamiltonTransportationInput: TransportationInput = plainToClass(TransportationInput, blankTransportationData); 
        let addressInput: AddressInput = new AddressInput();
        addressInput.street1 = "   ";
        addressInput.city = "    ";
        addressInput.countryCode = "   ";
        hamiltonTransportationInput.address = addressInput;
        await expect(service.save(hamiltonTransportationInput)
        ).rejects.toThrowError("desc, email, phone, url, street1, city, countryCode should not contain blank spaces only.");
    });
});

describe("Transportation Service Tests", () => {
    it("Service should not find a transportation, transportation should not exist with given facility id", async () => {
        const transportationResult: Transportation[] = await service.getAllTransportations("ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should not find a transportation, transportation should not exist with given facility id", async () => {
        const transportationResult: Transportation[] = await service.getAllTransportationsWithFacility("ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should not find a transportation, transportation should not exist with given transportation type and facility id", async () => {
        const transportationResult: Transportation[] | null = await service.getTransportation("WALKING", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should not find a transportation, transportation should not exist with given transportation type and facility id", async () => {
        const transportationResult: Transportation[] | null = await service.getTransportationWithFacility("WALKING", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Service Tests", () => {
    it("Service should not find a transportation, transportation should not exist with given transportation type", async () => {
        const transportationResult: Transportation[] | null = await service.getTransportationWithTypeId("5f05d1474b5dcbb405111935");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});