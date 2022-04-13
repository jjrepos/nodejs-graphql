import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { TransportationRepository } from "../../src/api/repository/TransportationRepository";
import { TransportationRepositoryImpl } from "../../src/api/repository/TransportationRepositoryImpl";
import { facilities, hamilton } from "../data/Facilities";
import { boozVisitorParkingTransportationData, hamiltonParkingTransportationData, toUpdateHamiltonParkingTransportationData, transportationsData } from "../data/Transportations";
import { parking, transportationTypes } from "../data/TransportationTypes";
import { TransportationComparator } from "../util/TransportationComparator";

const repo: TransportationRepository = new TransportationRepositoryImpl();

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

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations given facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] = await repo.findByFacilityId(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFields(transportationResult[0], hamiltonTransportation, parking);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations with facility given facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] = await repo.findWithFacilityByFacilityId(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFieldsWithFacility(transportationResult[0], hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations given type name and facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] | null = await repo.findByTypeFacilityId(parking.name, hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        TransportationComparator.compareAllFields(transportationResult![0], hamiltonTransportation, parking);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations with facility given type name and facility id", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        const transportationResult: Transportation[] | null = await repo.findWithFacilityByTypeFacilityId(parking.name, hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        TransportationComparator.compareAllFieldsWithFacility(transportationResult![0], hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations given type name, facility id, address", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();
        expect(hamilton).not.toBeNull();

        const transportationResult: Transportation[] | null = await repo.findByTypeFacilityIdAddress(parking.name, hamilton!._id, hamilton!.address);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        TransportationComparator.compareAllFields(transportationResult![0], hamiltonTransportation, parking);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should return transportations given type name, facility id, address", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);
        let parking: TransportationType | null = await TransportationTypeModel.findOne({ name: "PARKING" }).exec();
        expect(parking).not.toBeNull();

        const transportationResult: Transportation[] | null = await repo.findByTypeId(parking!._id.toString());
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);
        TransportationComparator.compareAllFields(transportationResult![0], hamiltonTransportation, parking!);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should create a new transportation", async () => {
        let boozTransportation: Transportation = plainToClass(Transportation, boozVisitorParkingTransportationData);
        let visitorParking: TransportationType | null = await TransportationTypeModel.findOne({ name: "VISITOR_PARKING" }).exec();
        let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
        expect(boozTransportation).not.toBeNull();
        expect(visitorParking).not.toBeNull();
        expect(booz).not.toBeNull();

        boozTransportation.facility = booz!;
        boozTransportation.type = visitorParking!;
        boozTransportation.address = booz!.address;
        const transportation: Transportation | null = await repo.save(boozTransportation);
        expect(transportation).not.toBeNull();
        TransportationComparator.compareAllFieldsWithFacility(transportation, boozTransportation, booz!, visitorParking!);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should update an existing transportation", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, toUpdateHamiltonParkingTransportationData);
        const transportationResult: Transportation[] = await repo.findByFacilityId(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);

        const transportation: Transportation | null = await repo.update(transportationResult[0]._id.toString(), hamiltonTransportation);
        expect(transportation).not.toBeNull();
        TransportationComparator.compareAllFields(transportation!, hamiltonTransportation, parking!);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should delete an existing transportation", async () => {
        const transportationResult: Transportation[] = await repo.findByFacilityId(hamilton._id);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(2);

        const transportation: Boolean = await repo.delete(transportationResult[0]._id.toString());
        expect(transportation).not.toBeNull();
        expect(transportation).toBe(true);

        const deletedTransportationResult: Transportation[] = await repo.findByFacilityId(hamilton._id);
        expect(deletedTransportationResult).not.toBeNull();
        expect(deletedTransportationResult).toHaveLength(1);
    });
});

// -ve test cases
describe("Transportation Repository Tests", () => {
    it("Repository should error to delete a transportation, if transportation does not exist", async () => {
        const transportation: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(transportation).not.toBeNull();
        expect(transportation).toBe(false);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should error to update a transportation, if transportation does not exist", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, toUpdateHamiltonParkingTransportationData);
        const transportation: Transportation | null = await repo.update("5f05d1474b5dcbb405111935", hamiltonTransportation);
        expect(transportation).toBeNull();
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given facility id", async () => {
        const transportationResult: Transportation[] = await repo.findByFacilityId("ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given facility id", async () => {
        const transportationResult: Transportation[] = await repo.findWithFacilityByFacilityId("ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given transportation type name and facility id", async () => {
        const transportationResult: Transportation[] | null = await repo.findByTypeFacilityId("WALKING", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given transportation type name and facility id", async () => {
        const transportationResult: Transportation[] | null = await repo.findWithFacilityByTypeFacilityId("WALKING", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given transportation type name, facility id and facility address", async () => {
        let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();
        expect(hamilton).not.toBeNull();

        const transportationResult: Transportation[] | null = await repo.findByTypeFacilityIdAddress("WALKING", "ZZZZ", hamilton!.address);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Transportation Repository Tests", () => {
    it("Repository should not find a transportation, transportation should not exist with given transportation type id", async () => {
        const transportationResult: Transportation[] | null = await repo.findByTypeId("5f05d1474b5dcbb405111935");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});