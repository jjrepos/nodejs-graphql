import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { TransportationTypeRepository } from "../../src/api/repository/TransportationTypeRepository";
import { TransportationTypeRepositoryImpl } from "../../src/api/repository/TransportationTypeRepositoryImpl";
import { metro, parking, transportationTypes, upgradeParking } from "../data/TransportationTypes";
import { TransportationTypeComparator } from "../util/TransportationTypeComparator";

import { connection } from "mongoose";

const repo: TransportationTypeRepository = new TransportationTypeRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await TransportationTypeModel.create(transportationTypes);
});

describe("TransportationType Repository Tests", () => {
    it("Repository should return transportation type given transportation type name", async () => {
        const transportationType: TransportationType | null = await repo.find(parking.name);
        expect(transportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(transportationType!, parking);
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should return all transportation types", async () => {
        const transportationTypes: TransportationType[] | null = await repo.findAll();
        expect(transportationTypes).not.toBeNull();
        expect(transportationTypes).toHaveLength(2);
        TransportationTypeComparator.compareAllFields(transportationTypes[0], parking);
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should create a new transportation type", async () => {
        const transportationType: TransportationType | null = await repo.save(metro);
        expect(transportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(transportationType, metro);
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should update an existing transportation type", async () => {
        const transportationType: TransportationType | null = await repo.find(parking.name);
        expect(transportationType).not.toBeNull();

        transportationType!.name = upgradeParking.name;
        transportationType!.desc = upgradeParking.desc;
        const updatedTransportationType: TransportationType | null = await repo.update(transportationType!._id.toString(), transportationType!);
        expect(updatedTransportationType).not.toBeNull();
        TransportationTypeComparator.compareAllFields(updatedTransportationType!, upgradeParking);

        const transportationTypes: TransportationType[] | null = await repo.findAll();
        expect(transportationTypes).not.toBeNull();
        expect(transportationTypes).toHaveLength(3);
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should delete a transportation type", async () => {
        const transportationType: TransportationType | null = await repo.find(metro.name);
        expect(transportationType).not.toBeNull();

        const deleteTransportationType: Boolean = await repo.delete(transportationType!._id.toString());
        expect(deleteTransportationType).not.toBeNull();
        expect(deleteTransportationType).toBe(true);

        const deletedTransportationType: TransportationType | null = await repo.find(metro.name);
        expect(deletedTransportationType).toBeNull();
    });
});

//all -ve test cases
describe("TransportationType Repository Tests", () => {
    it("Repository should error to delete a transportation type, if transportation type does not exist", async () => {
        const transportationType: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(transportationType).not.toBeNull();
        expect(transportationType).toBe(false);
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should error to update a transportation type, if transportation type does not exist", async () => {
        const transportationType: TransportationType | null = await repo.update("5f05d1474b5dcbb405111935", upgradeParking);
        expect(transportationType).toBeNull();
    });
});

describe("TransportationType Repository Tests", () => {
    it("Repository should error to find a transportation type, transportation type should not exist with given transportation type name", async () => {
        const transportationType: TransportationType | null = await repo.find("WALKING");
        expect(transportationType).toBeNull();
    });
});