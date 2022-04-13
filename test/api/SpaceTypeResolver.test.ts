import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { spaceTypes, collaborationRoom, upgradeCollaborationRoom, conferenceRoom } from "../data/SpaceTypes";
import { SpaceTypeComparator } from "../util/SpaceTypeComparator";

import { Space, SpaceModel } from "../../src/api/model/Space";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { spacesData } from "../data/Spaces";
import { facilities} from "../data/Facilities";

import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";

import { connection } from "mongoose";

beforeAll(async () => {
    await connection.db.dropDatabase();
    await SpaceTypeModel.create(spaceTypes);
    await FacilityModel.create(facilities);
    let collaborationRoom: SpaceType | null = await SpaceTypeModel.findOne({ name: "COLLABORATION_ROOM" }).exec();
    let huddleRoom: SpaceType | null = await SpaceTypeModel.findOne({ name: "HUDDLE_ROOM" }).exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let spaces: Space[] = plainToClass(Space, spacesData);
    spaces[0].facility = hamilton!;
    spaces[0].type = collaborationRoom!;
    spaces[1].facility = hamilton!;
    spaces[1].type = huddleRoom!;
    await SpaceModel.create(spaces);
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should return all space types", async () => {
        const spaceTypes = gql`
        query {
            allSpaceTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: spaceTypes });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allSpaceTypes).toBeDefined();
        expect(data.allSpaceTypes).not.toBeNull();
        expect(data.allSpaceTypes).toHaveLength(2)
        let type: SpaceType = data.allSpaceTypes[0];
        type.createdAt = new Date(type.createdAt);
        SpaceTypeComparator.compareAllFields(type, collaborationRoom);
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should return space type given type name", async () => {
        const spaceTypesByName = gql`
        query {
            spaceType(name: "${collaborationRoom.name}") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: spaceTypesByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.spaceType).toBeDefined();
        expect(data.spaceType).not.toBeNull();
        let type: SpaceType = data.spaceType;
        type.createdAt = new Date(type.createdAt);
        SpaceTypeComparator.compareAllFields(type, collaborationRoom);
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should save a space type", async () => {
        const saveSpaceType = gql`
        mutation {
            saveSpaceType(spaceType: {
                name: "${conferenceRoom.name}",
                desc: "${conferenceRoom.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: saveSpaceType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveSpaceType).toBeDefined();
        expect(data.saveSpaceType).not.toBeNull();
        let type: SpaceType = data.saveSpaceType;
        type.createdAt = new Date(type.createdAt);
        SpaceTypeComparator.compareAllFields(type, conferenceRoom);
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should update an existing space type", async () => {
        const spaceTypeByName = gql`
        query {
            spaceType(name: "${collaborationRoom.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: spaceTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.spaceType).toBeDefined();
        expect(typeData.data.spaceType).not.toBeNull();
        let typeId = typeData.data.spaceType.id;;
        expect(typeId).not.toBeNull();

        const updateSpaceType = gql`
        mutation {
            updateSpaceType(id: "${typeId}", spaceType: {
                name: "${upgradeCollaborationRoom.name}",
                desc: "${upgradeCollaborationRoom.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.mutate({ mutation: updateSpaceType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateSpaceType).toBeDefined();
        expect(data.updateSpaceType).not.toBeNull();
        let updated: SpaceType = data.updateSpaceType;
        updated.createdAt = new Date(updated.createdAt);
        SpaceTypeComparator.compareAllFields(updated, upgradeCollaborationRoom);
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should delete a space type", async () => {
        const spaceTypeByName = gql`
        query {
            spaceType(name: "${conferenceRoom.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: spaceTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.spaceType).toBeDefined();
        expect(typeData.data.spaceType).not.toBeNull();
        let typeId = typeData.data.spaceType.id;;
        expect(typeId).not.toBeNull();

        const deleteSpaceType = gql`
        mutation {
            deleteSpaceType(id: "${typeId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteSpaceType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteSpaceType).toBeDefined();
        expect(data.deleteSpaceType).not.toBeNull();
        expect(data.deleteSpaceType).toBe(true);

        const spaceTypes = gql`
        query {
            allSpaceTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const allSpaceData = await client.query({ query: spaceTypes });
        expect(allSpaceData.data).toBeDefined();
        expect(allSpaceData.data).not.toBeNull();
        expect(allSpaceData.data.allSpaceTypes).toBeDefined();
        expect(allSpaceData.data.allSpaceTypes).not.toBeNull();
        expect(allSpaceData.data.allSpaceTypes).toHaveLength(2)
    });
});

//all -ve test cases
describe("SpaceType Resolver Tests", () => {
    it("Resolver should error to delete a space type, space type should have associated spaces", async () => {
        const spaceTypeByName = gql`
        query {
            spaceType(name: "${upgradeCollaborationRoom.name}") {
                id
            }
        }`;
        let typeData = await client.query({ query: spaceTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        expect(typeData.data.spaceType).toBeDefined();
        expect(typeData.data.spaceType).not.toBeNull();
        let typeId = typeData.data.spaceType.id;;
        expect(typeId).not.toBeNull();

        const deleteSpaceType = gql`
        mutation {
            deleteSpaceType(id: "${typeId}")
        }`;
        await expect(client.mutate({
            mutation: deleteSpaceType
        })).rejects.toThrowError("GraphQL error: Cannot delete type - has associated spaces");
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should error to delete a space type, space type should not exist", async () => {
    const deleteSpaceType = gql`
        mutation {
            deleteSpaceType(id: "5f05d1474b5dcbb405111935")
        }`;
        await expect(client.mutate({
            mutation: deleteSpaceType
        })).rejects.toThrowError("GraphQL error: Unable to delete space type 5f05d1474b5dcbb405111935. Space type not found.");
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should error to update a space type, space type should not exist", async () => {
        const updateSpaceType = gql`
        mutation {
            updateSpaceType(id: "5f05d1474b5dcbb405111935", spaceType: {
                name: "${upgradeCollaborationRoom.name}",
                desc: "${upgradeCollaborationRoom.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateSpaceType
        })).rejects.toThrowError("GraphQL error: Unable to update space type 5f05d1474b5dcbb405111935. Space type not found.");
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should error to save a space type, space type should already exist", async () => {
        const saveSpaceType = gql`
        mutation {
            saveSpaceType(spaceType: {
                name: "${upgradeCollaborationRoom.name}",
                desc: "${upgradeCollaborationRoom.desc}",
            }) {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: saveSpaceType
        })).rejects.toThrowError("GraphQL error: Space type already exists");
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should error to save a space type, variables should not contain blank spaces only", async () => {
        const saveSpaceType = gql`
        mutation {
            saveSpaceType(spaceType: {
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
            mutation: saveSpaceType
        })).rejects.toThrowError("GraphQL error: name, desc should not contain blank spaces only.");
    });
});

describe("SpaceType Resolver Tests", () => {
    it("Resolver should not find space type, space type should not exist", async () => {
        const spaceTypeByName = gql`
        query {
            spaceType(name: "KITCHEN") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: spaceTypeByName });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.spaceType).toBeNull();
    });
});