import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { AmenityTypeRepository } from "../../src/api/repository/AmenityTypeRepository";
import { AmenityTypeRepositoryImpl } from "../../src/api/repository/AmenityTypeRepositoryImpl";
import { bikeRack, amenityTypes, faxMachine, upgradefaxMachine, upgradeBikeRack } from "../data/AmenityTypes";
import { AmenityTypeComparator } from "../util/AmenityTypeComparator";

import { connection } from "mongoose";

const repo: AmenityTypeRepository = new AmenityTypeRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await AmenityTypeModel.create(amenityTypes);
});

describe("AmenityType Repository Tests", () => {
    it("Repository should return amenity type given amenity type name", async () => {
        const amenityType: AmenityType | null = await repo.find(bikeRack.name);
        expect(amenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(amenityType!, bikeRack);
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should return all amenity types", async () => {
        const amenityTypes: AmenityType[] | null = await repo.findAll();
        expect(amenityTypes).not.toBeNull();
        expect(amenityTypes).toHaveLength(2);
        AmenityTypeComparator.compareAllFields(amenityTypes[0], bikeRack);
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should create a new amenity type", async () => {
        const amenityType: AmenityType | null = await repo.save(faxMachine);
        expect(amenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(amenityType, faxMachine);
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should update an existing amenity type", async () => {
        const amenityType: AmenityType | null = await repo.find(faxMachine.name);
        expect(amenityType).not.toBeNull();

        amenityType!.name = upgradefaxMachine.name;
        amenityType!.desc = upgradefaxMachine.desc;
        const updatedAmenityType: AmenityType | null = await repo.update(amenityType!._id.toString(), amenityType!);
        expect(updatedAmenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(updatedAmenityType!, upgradefaxMachine);

        const amenityTypes: AmenityType[] | null = await repo.findAll();
        expect(amenityTypes).not.toBeNull();
        expect(amenityTypes).toHaveLength(3);
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should delete a amenity type", async () => {
        const amenityType: AmenityType | null = await repo.find(upgradefaxMachine.name);
        expect(amenityType).not.toBeNull();

        const deleteAmenityType: Boolean = await repo.delete(amenityType!._id.toString());
        expect(deleteAmenityType).not.toBeNull();
        expect(deleteAmenityType).toBe(true);

        const deletedAmenityType: AmenityType | null = await repo.find(upgradefaxMachine.name);
        expect(deletedAmenityType).toBeNull();
    });
});

//all -ve test cases
describe("AmenityType Repository Tests", () => {
    it("Repository should error to delete a amenity type, if amenity type does not exist", async () => {
        const amenityType: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(amenityType).not.toBeNull();
        expect(amenityType).toBe(false);
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should error to update a amenity type, if amenity type does not exist", async () => {
        const amenityType: AmenityType | null = await repo.update("5f05d1474b5dcbb405111935", upgradeBikeRack);
        expect(amenityType).toBeNull();
    });
});

describe("AmenityType Repository Tests", () => {
    it("Repository should error to find a amenity type, amenity type should not exist with given amenity type name", async () => {
        const amenityType: AmenityType | null = await repo.find("CHILD_CARE_CENTER");
        expect(amenityType).toBeNull();
    });
});