import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { amenityTypes, bikeRack, faxMachine, upgradefaxMachine } from "../data/AmenityTypes";
import { AmenityTypeComparator } from "../util/AmenityTypeComparator";

import { Amenity, AmenityModel } from "../../src/api/model/Amenity";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { amenitiesData } from "../data/Amenities";
import { facilities} from "../data/Facilities";


import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";

import { connection } from "mongoose";

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

describe("AmenityType Resolver Tests", () => {
    it("Resolver should return all amenity types", async () => {
        const amenityTypes = gql`
        query {
            allAmenityTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: amenityTypes });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allAmenityTypes).toBeDefined();
        expect(data.allAmenityTypes).not.toBeNull();
        expect(data.allAmenityTypes).toHaveLength(2)
        let type: AmenityType = data.allAmenityTypes[0];
        type.createdAt = new Date(type.createdAt);
        AmenityTypeComparator.compareAllFields(type, bikeRack);
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should return amenity type given type name", async () => {
        const amenityTypeByName = gql`
        query {
            amenityType(name: "${bikeRack.name}") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: amenityTypeByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.amenityType).toBeDefined();
        expect(data.amenityType).not.toBeNull();
        let type: AmenityType = data.amenityType;
        type.createdAt = new Date(type.createdAt);
        AmenityTypeComparator.compareAllFields(type, bikeRack);
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should save a amenity type", async () => {
        const saveAmenityType = gql`
        mutation {
            saveAmenityType(amenityType: {
                name: "${faxMachine.name}",
                desc: "${faxMachine.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: saveAmenityType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveAmenityType).toBeDefined();
        expect(data.saveAmenityType).not.toBeNull();
        let type: AmenityType = data.saveAmenityType;
        type.createdAt = new Date(type.createdAt);
        AmenityTypeComparator.compareAllFields(type, faxMachine);
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should update an existing amenity type", async () => {
        const amenityTypeByName = gql`
        query {
            amenityType(name: "${faxMachine.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: amenityTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.amenityType).toBeDefined();
        expect(typeData.data.amenityType).not.toBeNull();
        let typeId = typeData.data.amenityType.id;;
        expect(typeId).not.toBeNull();

        const updateAmenityType = gql`
        mutation {
            updateAmenityType(id: "${typeId}", amenityType: {
                name: "${upgradefaxMachine.name}",
                desc: "${upgradefaxMachine.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: updateAmenityType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateAmenityType).toBeDefined();
        expect(data.updateAmenityType).not.toBeNull();
        let updated: AmenityType = data.updateAmenityType;
        updated.createdAt = new Date(updated.createdAt);
        AmenityTypeComparator.compareAllFields(updated, upgradefaxMachine);
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should delete a amenity type", async () => {
        const amenityTypeByName = gql`
        query {
            amenityType(name: "${upgradefaxMachine.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: amenityTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.amenityType).toBeDefined();
        expect(typeData.data.amenityType).not.toBeNull();
        let typeId = typeData.data.amenityType.id;;
        expect(typeId).not.toBeNull();

        const deleteAmenityType = gql`
        mutation {
            deleteAmenityType(id: "${typeId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteAmenityType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteAmenityType).toBeDefined();
        expect(data.deleteAmenityType).not.toBeNull();
        expect(data.deleteAmenityType).toBe(true);

        const amenityTypes = gql`
        query {
            allAmenityTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const allAmenityTypesData = await client.query({ query: amenityTypes });
        expect(allAmenityTypesData.data).toBeDefined();
        expect(allAmenityTypesData.data).not.toBeNull();
        expect(allAmenityTypesData.data.allAmenityTypes).toBeDefined();
        expect(allAmenityTypesData.data.allAmenityTypes).not.toBeNull();
        expect(allAmenityTypesData.data.allAmenityTypes).toHaveLength(2)
    });
});

//all -ve test cases
describe("AmenityType Resolver Tests", () => {
    it("Resolver should error to delete a amenity type, amenity type should have associated amenities", async () => {
        const amenityTypeByName = gql`
        query {
            amenityType(name: "${bikeRack.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: amenityTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.amenityType).toBeDefined();
        expect(typeData.data.amenityType).not.toBeNull();
        let typeId = typeData.data.amenityType.id;;
        expect(typeId).not.toBeNull();

        const deleteAmenityType = gql`
        mutation {
            deleteAmenityType(id: "${typeId}")
        }`;
        await expect(client.mutate({
            mutation: deleteAmenityType
        })).rejects.toThrowError("GraphQL error: Cannot delete type - has associated amenities");
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should error to delete a amenity type, amenity type should not exist", async () => {
    const deleteAmenityType = gql`
        mutation {
            deleteAmenityType(id: "5f05d1474b5dcbb405111935")
        }`;
        await expect(client.mutate({
            mutation: deleteAmenityType
        })).rejects.toThrowError("GraphQL error: Unable to delete amenity type 5f05d1474b5dcbb405111935. Amenity type not found.");
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should error to update a amenity type, amenity type should not exist", async () => {
        const updateAmenityType = gql`
        mutation {
            updateAmenityType(id: "5f05d1474b5dcbb405111935", amenityType: {
                name: "${upgradefaxMachine.name}",
                desc: "${upgradefaxMachine.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateAmenityType
        })).rejects.toThrowError("GraphQL error: Unable to update amenity type 5f05d1474b5dcbb405111935. Amenity type not found.");
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should error to save a amenity type, amenity type should already exist", async () => {
        const saveAmenityType = gql`
        mutation {
            saveAmenityType(amenityType: {
                name: "${bikeRack.name}",
                desc: "${bikeRack.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: saveAmenityType
        })).rejects.toThrowError("GraphQL error: Amenity type already exists");
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should error to save a amenity type, variables should not contain blank spaces only", async () => {
        const saveAmenityType = gql`
        mutation {
            saveAmenityType(amenityType: {
                name: "   ",
                desc: "   ",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: saveAmenityType
        })).rejects.toThrowError("GraphQL error: name, desc should not contain blank spaces only.");
    });
});

describe("AmenityType Resolver Tests", () => {
    it("Resolver should not find amenity type, amenity type should not exist", async () => {
        const amenityTypeByName = gql`
        query {
            amenityType(name: "CHILD_CARE_CENTER") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: amenityTypeByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.amenityType).toBeNull();
    });
});