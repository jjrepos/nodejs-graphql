import { Amenity, AmenityModel } from "../../src/api/model/Amenity";
import { AmenityService } from "../../src/api/service/AmenityService";
import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";
import { AmenityComparator } from "../util/AmenityComparator";

import { blankAmenityData, amenitiesData, bikeRackAmenityData, faxMachineAmenityData, toUpdateFaxMachineAmenityData, withincorrectOpHoursAddrsBikeRackAmenityData, withOpHoursNoAddrsBikeRackAmenityData } from "../data/Amenities";
import { amenityTypes, bikeRack, faxMachine } from "../data/AmenityTypes";
import { facilities, hamilton} from "../data/Facilities";
import { AmenityInput } from "../../src/api/resolver/types/input/AmenityInput";

import { connection } from "mongoose";
import { AddressInput } from "../../src/api/resolver/types/input/AddressInput";

const service: AmenityService = new AmenityService();

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

describe("Amenity Service Tests", () => {
    it("Service should return amenities given facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] = await service.getAllAmenities(hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(2);
        AmenityComparator.compareAllFields(amenityResult[0], hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should return amenities with facility given facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] = await service.getAllAmenitiesWithFacility(hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(2);
        AmenityComparator.compareAllFieldsWithFacility(amenityResult[0], hamiltonAmenity, hamilton, bikeRack);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should return amenities given type name and facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] | null = await service.getAmenity(bikeRack.name, hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        AmenityComparator.compareAllFields(amenityResult![0], hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should return amenities with facility given type name and facility id", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);
        const amenityResult: Amenity[] | null = await service.getAmenityWithFacility(bikeRack.name, hamilton._id);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        AmenityComparator.compareAllFieldsWithFacility(amenityResult![0], hamiltonAmenity, hamilton, bikeRack);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should create a new amenity", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, faxMachineAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        hamiltonAmenityInput.type = faxMachine.name;
        let hamiltonAmenity: Amenity = plainToClass(Amenity, faxMachineAmenityData);
        const amenity: Amenity | null = await service.save(hamiltonAmenityInput);
        expect(amenity).not.toBeNull();
        AmenityComparator.compareAllFields(amenity, hamiltonAmenity, faxMachine!);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should update an existing amenity", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, faxMachineAmenityData);
        let hamiltonAmenity: Amenity = plainToClass(Amenity, toUpdateFaxMachineAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        hamiltonAmenityInput.type = faxMachine.name;
        const amenityResult: Amenity[] | null = await service.getAmenity(faxMachine!.name, hamiltonAmenityInput.facility);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        expect(amenityResult![0]).not.toBeNull();

        const updateResult: Amenity | null = await service.update(amenityResult![0]._id.toString(), hamiltonAmenityInput);
        expect(updateResult).not.toBeNull();
        AmenityComparator.compareAllFields(updateResult!, hamiltonAmenity, faxMachine!);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should delete an existing amenity", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, toUpdateFaxMachineAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        const transportationResult: Amenity[] | null = await service.getAmenity(faxMachine!.name, hamiltonAmenityInput.facility);
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(1);
        
        const amenity: Boolean = await service.delete(transportationResult![0]._id.toString());
        expect(amenity).not.toBeNull();
        expect(amenity).toBe(true);

        const postDeleteAmenityResult: Amenity[] | null = await service.getAmenity(faxMachine!.name, hamiltonAmenityInput.facility);
        expect(postDeleteAmenityResult).not.toBeNull();
        expect(postDeleteAmenityResult).toHaveLength(0);
    });
});

//all -ve test cases
describe("Amenity Service Tests", () => {
    it("Service should error to delete an amenity, amenity should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete amenity 5f05d1474b5dcbb405111935. Amenity not found.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to update an amenity, amenity should not exist", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, bikeRackAmenityData);
        hamiltonAmenityInput.type = bikeRack.name;
        hamiltonAmenityInput.facility = hamilton._id;
        await expect(service.update("5f05d1474b5dcbb405111935", hamiltonAmenityInput!) 
        ).rejects.toThrowError("Unable to update amenity 5f05d1474b5dcbb405111935. Amenity not found.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to update an amenity, facility should not exist", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, bikeRackAmenityData);
        hamiltonAmenityInput.type = bikeRack.name;
        await expect(service.update("5f05d1474b5dcbb405111935", hamiltonAmenityInput!) 
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to update an amenity, operational hours should be incorrect", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, withincorrectOpHoursAddrsBikeRackAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        const amenityResult: Amenity[] | null = await service.getAmenity(bikeRack!.name, hamiltonAmenityInput.facility);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        expect(amenityResult![0]).not.toBeNull();

        await expect(service.update(amenityResult![0]._id.toString(), hamiltonAmenityInput)
        ).rejects.toThrowError("Duplicate days found.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to update an amenity, address should be missing", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, withOpHoursNoAddrsBikeRackAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        const amenityResult: Amenity[] | null = await service.getAmenity(bikeRack!.name, hamiltonAmenityInput.facility);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        expect(amenityResult![0]).not.toBeNull();

        await expect(service.update(amenityResult![0]._id.toString(), hamiltonAmenityInput)
        ).rejects.toThrowError("Amenity address is missing.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to update an amenity, amenity type should not exist", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, bikeRackAmenityData);
        hamiltonAmenityInput.facility = hamilton._id;
        const amenityResult: Amenity[] | null = await service.getAmenity(bikeRack!.name, hamiltonAmenityInput.facility);
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(1);
        expect(amenityResult![0]).not.toBeNull();
        hamiltonAmenityInput.type = "CHILD_CARE_CENTER";
        
        await expect(service.update(amenityResult![0]._id.toString(), hamiltonAmenityInput)
        ).rejects.toThrowError("AmenityType does not exist");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to save an amenity, facility should not exist", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, bikeRackAmenityData);
        hamiltonAmenityInput.type = bikeRack.name;
        await expect(service.save(hamiltonAmenityInput) 
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to save a amenity, amenity type should not exist", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, withincorrectOpHoursAddrsBikeRackAmenityData);
        hamiltonAmenityInput.type = "CHILD_CARE_CENTER";
        hamiltonAmenityInput.facility = hamilton._id;
        await expect(service.save(hamiltonAmenityInput)
        ).rejects.toThrowError("AmenityType does not exist");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to save a amenity, operational hours should be incorrect", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, withincorrectOpHoursAddrsBikeRackAmenityData);
        hamiltonAmenityInput.type = bikeRack.name;
        hamiltonAmenityInput.facility = hamilton._id;
        await expect(service.save(hamiltonAmenityInput)
        ).rejects.toThrowError("Duplicate days found.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to save a amenity, address should be missing", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, withOpHoursNoAddrsBikeRackAmenityData);
        hamiltonAmenityInput.type = bikeRack.name;
        hamiltonAmenityInput.facility = hamilton._id;
        await expect(service.save(hamiltonAmenityInput)
        ).rejects.toThrowError("Amenity address is missing.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should error to save a amenity, variables should not contain blank spaces only", async () => {
        let hamiltonAmenityInput: AmenityInput = plainToClass(AmenityInput, blankAmenityData);
        let addressInput: AddressInput = new AddressInput();
        addressInput.street1 = "   ";
        addressInput.city = "    ";
        addressInput.countryCode = "   ";
        hamiltonAmenityInput.address = addressInput;
        await expect(service.save(hamiltonAmenityInput)
        ).rejects.toThrowError("desc, email, phone, url, street1, city, countryCode should not contain blank spaces only.");
    });
});

describe("Amenity Service Tests", () => {
    it("Service should not find a amenity, amenity should not exist with given facility id", async () => {
        const amenityResult: Amenity[] = await service.getAllAmenities("ZZZZ");
        expect(amenityResult).not.toBeNull();
        expect(amenityResult).toHaveLength(0);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should not find a amenity, amenity should not exist with given facility id", async () => {
        const transportationResult: Amenity[] = await service.getAllAmenitiesWithFacility("ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should not find a amenity, amenity should not exist with given amenity type and facility id", async () => {
        const transportationResult: Amenity[] | null = await service.getAmenity("CHILD_CARE_CENTER", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});

describe("Amenity Service Tests", () => {
    it("Service should not find a amenity, amenity should not exist with given amenity type and facility id", async () => {
        const transportationResult: Amenity[] | null = await service.getAmenityWithFacility("CHILD_CARE_CENTER", "ZZZZ");
        expect(transportationResult).not.toBeNull();
        expect(transportationResult).toHaveLength(0);
    });
});