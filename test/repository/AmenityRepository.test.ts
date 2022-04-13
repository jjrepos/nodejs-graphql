import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Amenity, AmenityModel } from "../../src/api/model/Amenity";
import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { AmenityRepository } from "../../src/api/repository/AmenityRepository";
import { AmenityRepositoryImpl } from "../../src/api/repository/AmenityRepositoryImpl";
import { facilities, hamilton, booz } from "../data/Facilities";
import { amenitiesData, bikeRackAmenityData, faxMachineAmenityData, toUpdateFaxMachineAmenityData } from "../data/Amenities";
import { bikeRack, amenityTypes, faxMachine } from "../data/AmenityTypes";
import { AmenityComparator } from "../util/AmenityComparator";

const repo: AmenityRepository = new AmenityRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await AmenityTypeModel.create(amenityTypes);
    await AmenityTypeModel.create(faxMachine);
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

describe("Amenity Repository Tests", () => {
    it("Repository should return amenity given facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] = await repo.findByFacilityId(hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(2);
        AmenityComparator.compareAllFields(amenityResult[0], hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should return amenities with facility given facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] = await repo.findWithFacilityByFacilityId(hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(2);
        AmenityComparator.compareAllFieldsWithFacility(amenityResult[0], hamiltonAmenity, hamilton, bikeRack);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should return amenities given type name and facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] | null = await repo.findByTypeFacilityId(bikeRack.name, hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        AmenityComparator.compareAllFields(amenityResult![0], hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should return amenities with facility given type name and facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] | null = await repo.findWithFacilityByTypeFacilityId(bikeRack.name, hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        AmenityComparator.compareAllFieldsWithFacility(amenityResult![0], hamiltonAmenity, hamilton, bikeRack);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should create a new amenity", async () => {
        let boozAmenity: Amenity = plainToClass(Amenity, faxMachineAmenityData);
        let faxMachineAmenityType: AmenityType | null = await AmenityTypeModel.findOne({ name: "FAX_MACHINE" }).exec();
        let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
        expect(boozAmenity).not.toBeNull();
        expect(faxMachineAmenityType).not.toBeNull();
        expect(booz).not.toBeNull();

        boozAmenity.facility = booz!;
        boozAmenity.type = faxMachineAmenityType!;
        boozAmenity.address = booz!.address;
        const amenity: Amenity | null = await repo.save(boozAmenity);
        expect(amenity).not.toBeNull();
        AmenityComparator.compareAllFieldsWithFacility(amenity, boozAmenity, booz!, faxMachineAmenityType!);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should update an existing amenity", async () => {
        let boozAmenity: Amenity = plainToClass(Amenity, toUpdateFaxMachineAmenityData);
        const amenityResult: Amenity[] = await repo.findByFacilityId(booz._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);

        const amenity: Amenity | null = await repo.update(amenityResult[0]._id.toString(), boozAmenity);
        expect(amenity).not.toBeNull();
        AmenityComparator.compareAllFields(amenity!, boozAmenity, faxMachine!);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should delete an existing amenity", async () => {
        const amenityResult: Amenity[] = await repo.findByFacilityId(booz._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);

        const transportation: Boolean = await repo.delete(amenityResult[0]._id.toString());
        expect(transportation).not.toBeNull();
        expect(transportation).toBe(true);

        const deletedAmenityResult: Amenity[] = await repo.findByFacilityId(booz._id);
        expect(deletedAmenityResult).not.toBeNull();
        expect(deletedAmenityResult).toHaveLength(0);
    });
});

// -ve test cases
describe("Amenity Repository Tests", () => {
    it("Repository should error to delete a amenity, if amenity does not exist", async () => {
        const amenity: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(amenity).not.toBeNull();
        expect(amenity).toBe(false);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should error to update a amenity, if amenity does not exist", async () => {
        let boozAmenity: Amenity = plainToClass(Amenity, toUpdateFaxMachineAmenityData);
        const amenity: Amenity | null = await repo.update("5f05d1474b5dcbb405111935", boozAmenity);
        expect(amenity).toBeNull();
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should not find a amenity, amenity should not exist with given facility id", async () => {
        const amenityResult: Amenity[] = await repo.findByFacilityId("ZZZZ");
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(0);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should not find a amenity, amenity should not exist with given facility id", async () => {
        const amenityResult: Amenity[] = await repo.findWithFacilityByFacilityId("ZZZZ");
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(0);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should not find a amenity, amenity should not exist with given amenity type name and facility id", async () => {
        const amenityResult: Amenity[] | null = await repo.findByTypeFacilityId("CHILD_CARE_CENTER", "ZZZZ");
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(0);
    });
});

describe("Amenity Repository Tests", () => {
    it("Repository should not find a amenity, amenity should not exist with given amenity type name and facility id", async () => {
        const amenityResult: Amenity[] | null = await repo.findWithFacilityByTypeFacilityId("CHILD_CARE_CENTER", "ZZZZ");
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(0);
    });
});