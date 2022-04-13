import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { upgradeMetro, metro, parking, transportationTypes } from "../data/TransportationTypes";
import { TransportationTypeComparator } from "../util/TransportationTypeComparator";

import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { transportationsData } from "../data/Transportations";
import { facilities} from "../data/Facilities";


import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";

import { connection } from "mongoose";

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

describe("TransportationType Resolver Tests", () => {
    it("Resolver should return all transportation types", async () => {
        const transportationTypes = gql`
        query {
            allTransportationsTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: transportationTypes });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allTransportationsTypes).toBeDefined();
        expect(data.allTransportationsTypes).not.toBeNull();
        expect(data.allTransportationsTypes).toHaveLength(2)
        let type: TransportationType = data.allTransportationsTypes[0];
        type.createdAt = new Date(type.createdAt);
        TransportationTypeComparator.compareAllFields(type, parking);
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should return transportation type given type name", async () => {
        const transportationTypeByName = gql`
        query {
            transportationType(name: "${parking.name}") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: transportationTypeByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.transportationType).toBeDefined();
        expect(data.transportationType).not.toBeNull();
        let type: TransportationType = data.transportationType;
        type.createdAt = new Date(type.createdAt);
        TransportationTypeComparator.compareAllFields(type, parking);
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should save a transportation type", async () => {
        const saveTransportationType = gql`
        mutation {
            saveTransportationType(transportationType: {
                name: "${metro.name}",
                desc: "${metro.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: saveTransportationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveTransportationType).toBeDefined();
        expect(data.saveTransportationType).not.toBeNull();
        let type: TransportationType = data.saveTransportationType;
        type.createdAt = new Date(type.createdAt);
        TransportationTypeComparator.compareAllFields(type, metro);
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should update an existing transportation type", async () => {
        const transportationTypeByName = gql`
        query {
            transportationType(name: "${metro.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: transportationTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.transportationType).toBeDefined();
        expect(typeData.data.transportationType).not.toBeNull();
        let typeId = typeData.data.transportationType.id;;
        expect(typeId).not.toBeNull();

        const updateTransportationType = gql`
        mutation {
            updateTransportationType(id: "${typeId}", transportationType: {
                name: "${upgradeMetro.name}",
                desc: "${upgradeMetro.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: updateTransportationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateTransportationType).toBeDefined();
        expect(data.updateTransportationType).not.toBeNull();
        let updated: TransportationType = data.updateTransportationType;
        updated.createdAt = new Date(updated.createdAt);
        TransportationTypeComparator.compareAllFields(updated, upgradeMetro);
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should delete a transportation type", async () => {
        const transportationTypeByName = gql`
        query {
            transportationType(name: "${metro.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: transportationTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.transportationType).toBeDefined();
        expect(typeData.data.transportationType).not.toBeNull();
        let typeId = typeData.data.transportationType.id;;
        expect(typeId).not.toBeNull();

        const deleteTransportationType = gql`
        mutation {
            deleteTransportationType(id: "${typeId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteTransportationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteTransportationType).toBeDefined();
        expect(data.deleteTransportationType).not.toBeNull();
        expect(data.deleteTransportationType).toBe(true);

        const transportationTypes = gql`
        query {
            allTransportationsTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const allTransportationsData = await client.query({ query: transportationTypes });
        expect(allTransportationsData.data).toBeDefined();
        expect(allTransportationsData.data).not.toBeNull();
        expect(allTransportationsData.data.allTransportationsTypes).toBeDefined();
        expect(allTransportationsData.data.allTransportationsTypes).not.toBeNull();
        expect(allTransportationsData.data.allTransportationsTypes).toHaveLength(2)
    });
});

//all -ve test cases
describe("TransportationType Resolver Tests", () => {
    it("Resolver should error to delete a transportation type, transportation type should have associated transportations", async () => {
        const transportationTypeByName = gql`
        query {
            transportationType(name: "${parking.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: transportationTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.transportationType).toBeDefined();
        expect(typeData.data.transportationType).not.toBeNull();
        let typeId = typeData.data.transportationType.id;;
        expect(typeId).not.toBeNull();

        const deleteTransportationType = gql`
        mutation {
            deleteTransportationType(id: "${typeId}")
        }`;
        await expect(client.mutate({
            mutation: deleteTransportationType
        })).rejects.toThrowError("GraphQL error: Cannot delete type - has associated transportations");
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should error to delete a transportation type, transportation type should not exist", async () => {
    const deleteTransportationType = gql`
        mutation {
            deleteTransportationType(id: "5f05d1474b5dcbb405111935")
        }`;
        await expect(client.mutate({
            mutation: deleteTransportationType
        })).rejects.toThrowError("GraphQL error: Unable to delete transportation type 5f05d1474b5dcbb405111935. Transportation type not found.");
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should error to update a transportation type, transportation type should not exist", async () => {
        const updateTransportationType = gql`
        mutation {
            updateTransportationType(id: "5f05d1474b5dcbb405111935", transportationType: {
                name: "${upgradeMetro.name}",
                desc: "${upgradeMetro.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportationType
        })).rejects.toThrowError("GraphQL error: Unable to update transportation type 5f05d1474b5dcbb405111935. Transportation type not found.");
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should error to save a transportation type, transportation type should already exist", async () => {
        const saveTransportationType = gql`
        mutation {
            saveTransportationType(transportationType: {
                name: "${parking.name}",
                desc: "${parking.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: saveTransportationType
        })).rejects.toThrowError("GraphQL error: Transportation type already exists");
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should error to save a transportation type, variables should not contain blank spaces only", async () => {
        const saveTransportationType = gql`
        mutation {
            saveTransportationType(transportationType: {
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
            mutation: saveTransportationType
        })).rejects.toThrowError("GraphQL error: name, desc should not contain blank spaces only.");
    });
});

describe("TransportationType Resolver Tests", () => {
    it("Resolver should not find transportation type, transportation type should not exist", async () => {
        const transportationTypeByName = gql`
        query {
            transportationType(name: "WALKING") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: transportationTypeByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.transportationType).toBeNull();
    });
});