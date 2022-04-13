import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { Amenity, AmenityModel } from "../../src/api/model/Amenity";
import { AmenityTypeService } from "../../src/api/service/AmenityTypeService";
import { amenityTypes, faxMachine, bikeRack, upgradefaxMachine, blankType } from "../data/AmenityTypes";
import { AmenityTypeComparator } from "../util/AmenityTypeComparator";

import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { amenitiesData } from "../data/Amenities";
import { facilities} from "../data/Facilities";

import { connection } from "mongoose";

const service: AmenityTypeService = new AmenityTypeService();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await AmenityTypeModel.create(amenityTypes);
    await FacilityModel.create(facilities);

    let bikeRack: AmenityType | null = await AmenityTypeModel.findOne({ name: "BIKE_RACK" }).exec();
    let printing: AmenityType | null = await AmenityTypeModel.findOne({ name: "PRINTING" }).exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let amenities: Amenity[] = plainToClass(Amenity, amenitiesData);
    amenities[0].facility = hamilton!;
    amenities[0].type = bikeRack!;
    amenities[0].address = hamilton!.address;
    amenities[1].facility = hamilton!;
    amenities[1].type = printing!;
    amenities[1].address = hamilton!.address;
    await AmenityModel.create(amenities);
});

describe("AmenityType Service Tests", () => {
    it("Service should return amenity type given type name", async () => {
        const amenityType: AmenityType | null = await service.getAmenityType(bikeRack.name);
        expect(amenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(amenityType!, bikeRack);
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should return all amenity types", async () => {
        const amenityTypes: AmenityType[] | null = await service.getAllAmenityTypes();
        expect(amenityTypes).not.toBeNull();
        expect(amenityTypes).toHaveLength(2);
        AmenityTypeComparator.compareAllFields(amenityTypes[0], bikeRack);
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should create a new amenity type", async () => {
        const amenityType: AmenityType | null = await service.save(faxMachine);
        expect(amenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(amenityType, faxMachine);
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should update an existing amenity type", async () => {
        const amenityType: AmenityType | null = await service.getAmenityType(faxMachine.name);
        expect(amenityType).not.toBeNull();

        amenityType!.name = upgradefaxMachine.name;
        amenityType!.desc = upgradefaxMachine.desc;
        const updatedAmenityType = await service.update(amenityType!._id.toHexString(), amenityType!);
        expect(updatedAmenityType).not.toBeNull();
        AmenityTypeComparator.compareAllFields(updatedAmenityType!, upgradefaxMachine);

        const amenityTypes: AmenityType[] | null = await service.getAllAmenityTypes();
        expect(amenityTypes).not.toBeNull();
        expect(amenityTypes).toHaveLength(3);
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should delete a amenity type", async () => {
        const amenityType: AmenityType | null = await service.getAmenityType(upgradefaxMachine.name);
        expect(amenityType).not.toBeNull();

        await service.delete(amenityType!._id.toString());
        const deletedAmenityType: AmenityType | null = await service.getAmenityType(upgradefaxMachine.name);
        expect(deletedAmenityType).toBeNull();
    });
});

//all -ve test cases
describe("AmenityType Service Tests", () => {
    it("Service should error to delete a amenity type, amenity type should have associated amenities", async () => {
        const amenityType: AmenityType | null = await service.getAmenityType(bikeRack.name);
        expect(amenityType).not.toBeNull();

        await expect(service.delete(amenityType!._id.toString())
        ).rejects.toThrowError("Cannot delete type - has associated amenities");
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should error to delete a amenity type, amenity type should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete amenity type 5f05d1474b5dcbb405111935. Amenity type not found.");
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should error to update a amenity type, amenity type should not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405111935", upgradefaxMachine!) 
        ).rejects.toThrowError("Unable to update amenity type 5f05d1474b5dcbb405111935. Amenity type not found.");
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should error to save a amenity type, amenity type should already exist", async () => {
        await expect(service.save(bikeRack)
        ).rejects.toThrowError("Amenity type already exists");
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should error to save a amenity type, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankType)
        ).rejects.toThrowError("name, desc should not contain blank spaces only.");
    });
});

describe("AmenityType Service Tests", () => {
    it("Service should not find amenity type, amenity type should not exist", async () => {
        const amenityType: AmenityType | null = await service.getAmenityType("CHILD_CARE_CENTER");
        expect(amenityType).toBeNull();
    });
});