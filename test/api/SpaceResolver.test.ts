import { gql } from "apollo-boost";
import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Space, SpaceModel } from "../../src/api/model/Space";
import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { facilities, hamilton } from "../data/Facilities";
import { spacesData, upgradeCollaborationRoomHamilton, teamRoomHamilton, conferenceRoomHamilton } from "../data/Spaces";
import { spaceTypes, collaborationRoom, teamRoom, conferenceRoom } from "../data/SpaceTypes";
import { client } from "../util/GraphQLClient";
import { SpaceComparator } from "../util/SpaceComparator";
import { SpaceOutput } from "../../src/api/resolver/types/output/SpaceOutput";

beforeAll(async () => {
    await connection.db.dropDatabase();
    await SpaceTypeModel.create(spaceTypes);
    await SpaceTypeModel.create(teamRoom);
    await SpaceTypeModel.create(conferenceRoom);
    await FacilityModel.create(facilities);

    let collaborationRoom: SpaceType | null = await SpaceTypeModel.findOne({ name: "COLLABORATION_ROOM" }).exec();
    let teamRoomSpace: SpaceType | null = await SpaceTypeModel.findOne({ name: "TEAM_ROOM" }).exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let spaces: Space[] = plainToClass(Space, spacesData);
    spaces[0].facility = hamilton!;
    spaces[0].type = teamRoomSpace!;
    spaces[1].facility = hamilton!;
    spaces[1].type = collaborationRoom!;
    await SpaceModel.create(spaces);
});

describe("Space Resolver Tests", () => {
    it("Resolver should return all spaces", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);

        const allSpaces = gql`
        query {
            allSpaces(facilityId: "${hamilton._id}") {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allSpaces).toBeDefined();
        expect(data.allSpaces).not.toBeNull();
        expect(data.allSpaces).toHaveLength(2);
        let space: SpaceOutput = data.allSpaces[0];
        space.createdAt = new Date(space.createdAt);
        SpaceComparator.compareAllFieldsFromResolver(space, hamiltonSpace, teamRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should return all spaces with facilities", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);

        const allSpaces = gql`
        query {
            allSpaces(facilityId: "${hamilton._id}") {
                id,
                type,
                desc,
                createdAt,
                updatedAt,
                facility {
                    id,
                    name,
                    campusCode,
                    address {
                        street1,
                        city,
                        stateCode,
                        zipCode
                    },
                    location {
                        type,
                        coordinates
                    }
                }
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allSpaces).toBeDefined();
        expect(data.allSpaces).not.toBeNull();
        expect(data.allSpaces).toHaveLength(2);
        data.allSpaces[0].facility!._id = data.allSpaces[0].facility!.id;
        let space: SpaceOutput = data.allSpaces[0];
        space.createdAt = new Date(space.createdAt);
        SpaceComparator.compareAllFieldsWithFacilityFromResolver(space, hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should return all spaces given type name", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);

        const allSpaces = gql`
        query {
            space(name: "${teamRoom.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.space).toBeDefined();
        expect(data.space).not.toBeNull();
        expect(data.space).toHaveLength(1);
        let space: SpaceOutput = data.space[0];
        space.createdAt = new Date(space.createdAt);
        SpaceComparator.compareAllFieldsFromResolver(space, hamiltonSpace, teamRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should return all spaces with facilities given type name", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);

        const allSpaces = gql`
        query {
            space(name: "${teamRoom.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                desc,
                createdAt,
                updatedAt,
                facility {
                    id,
                    name,
                    campusCode,
                    address {
                        street1,
                        city,
                        stateCode,
                        zipCode
                    },
                    location {
                        type,
                        coordinates
                    }
                }
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.space).toBeDefined();
        expect(data.space).not.toBeNull();
        expect(data.space).toHaveLength(1);
        data.space[0].facility!._id = data.space[0].facility!.id;
        let space: SpaceOutput = data.space[0];
        space.createdAt = new Date(space.createdAt);
        SpaceComparator.compareAllFieldsWithFacilityFromResolver(space, hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should save a space", async () => {
        let hamiltonSpace: Space = plainToClass(Space, conferenceRoomHamilton);

        const saveSpace = gql`
        mutation {
            saveSpace(space: {
                type:"CONFERENCE_ROOM",
                desc: "- Large meeting space designed to accommodate 20 or more attendees. - Hamilton Conference Center – 2nd floor. - 703-917-2324. - Meetingservices.bah.com",
                facility:"HMLT",
            }) {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        const { data } = await client.mutate({ mutation: saveSpace });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveSpace).toBeDefined();
        expect(data.saveSpace).not.toBeNull();
        let space: SpaceOutput = data.saveSpace;
        space.createdAt = new Date(space.createdAt);
        SpaceComparator.compareAllFieldsFromResolver(space, hamiltonSpace, conferenceRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should update an existing space", async () => {
        let hamiltonSpace: Space = plainToClass(Space, upgradeCollaborationRoomHamilton);

        const spaceTypeByName = gql`
        query {
            space(name: "${collaborationRoom.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let spaceData = await client.query({ query: spaceTypeByName });
        expect(spaceData.data).toBeDefined();
        expect(spaceData.data).not.toBeNull();
        expect(spaceData.data.space).toBeDefined();
        expect(spaceData.data.space).not.toBeNull();
        expect(spaceData.data.space).toHaveLength(1);
        let spaceId = spaceData.data.space[0].id;
        expect(spaceId).not.toBeNull();

        const updateSpace = gql`
        mutation {
            updateSpace(id: "${spaceId}", space: {
                desc: "updated description",
                type:"COLLABORATION_ROOM",
                facility:"HMLT"
            }) {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        const { data } = await client.mutate({ mutation: updateSpace });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateSpace).toBeDefined();
        expect(data.updateSpace).not.toBeNull();
        let updated: SpaceOutput = data.updateSpace;
        updated.createdAt = new Date(updated.createdAt);
        SpaceComparator.compareAllFieldsFromResolver(updated, hamiltonSpace, collaborationRoom);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should delete a space", async () => {
        const spaceTypeByName = gql`
        query {
            space(name: "${conferenceRoom.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let spaceData = await client.query({ query: spaceTypeByName });
        expect(spaceData.data).toBeDefined();
        expect(spaceData.data).not.toBeNull();
        expect(spaceData.data.space).toBeDefined();
        expect(spaceData.data.space).not.toBeNull();
        expect(spaceData.data.space).toHaveLength(1);
        let spaceId = spaceData.data.space[0].id;
        expect(spaceId).not.toBeNull();

        const deleteSpace = gql`
        mutation {
            deleteSpace(id: "${spaceId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteSpace });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteSpace).toBeDefined();
        expect(data.deleteSpace).not.toBeNull();
        expect(data.deleteSpace).toBe(true);

        const postDeleteSpaceTypeByName = gql`
        query {
            space(name: "${conferenceRoom.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let postDeleteSpaceData = await client.query({ query: postDeleteSpaceTypeByName });
        expect(postDeleteSpaceData.data).toBeDefined();
        expect(postDeleteSpaceData.data).not.toBeNull();
        expect(postDeleteSpaceData.data.space).toBeDefined();
        expect(postDeleteSpaceData.data.space).not.toBeNull();
        expect(postDeleteSpaceData.data.space).toHaveLength(1);
    });
});

//all -ve test cases
describe("Space Resolver Tests", () => {
    it("Resolver should error to delete a space, space should not exist", async () => {
        const deleteSpace = gql`
        mutation {
            deleteSpace(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteSpace
        })).rejects.toThrowError("GraphQL error: Unable to delete space 5f05d1514b5dcbb405111945. Space not found.");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to update a space, space should not exist", async () => {
        const updateSpace = gql`
        mutation {
            updateSpace(id: "5f05d1514b5dcbb405111945", space: {
                desc: "Upgraded",
                type:"COLLABORATION_ROOM",
                facility:"HMLT"
            }) {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        await expect(client.mutate({
            mutation: updateSpace
        })).rejects.toThrowError("GraphQL error: Unable to update space 5f05d1514b5dcbb405111945. Space not found.");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to update a space, space type should not exist", async () => {
        const spaceTypeByName = gql`
        query {
            space(name: "${collaborationRoom.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let spaceData = await client.query({ query: spaceTypeByName });
        expect(spaceData.data).toBeDefined();
        expect(spaceData.data).not.toBeNull();
        expect(spaceData.data.space).toBeDefined();
        expect(spaceData.data.space).not.toBeNull();
        expect(spaceData.data.space).toHaveLength(1);
        let spaceId = spaceData.data.space[0].id;
        expect(spaceId).not.toBeNull();

        const updateSpace = gql`
        mutation {
            updateSpace(id: "${spaceId}", space: {
                desc: "upgraded",
                type:"KITCHEN",
                facility:"HMLT"
            }) {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        await expect(client.mutate({
            mutation: updateSpace
        })).rejects.toThrowError("GraphQL error: SpaceType does not exist");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to update a space, facility should not exist", async () => {
        const spaceTypeByName = gql`
        query {
            space(name: "${collaborationRoom.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let spaceData = await client.query({ query: spaceTypeByName });
        expect(spaceData.data).toBeDefined();
        expect(spaceData.data).not.toBeNull();
        expect(spaceData.data.space).toBeDefined();
        expect(spaceData.data.space).not.toBeNull();
        expect(spaceData.data.space).toHaveLength(1);
        let spaceId = spaceData.data.space[0].id;
        expect(spaceId).not.toBeNull();

        const updateSpace = gql`
        mutation {
            updateSpace(id: "${spaceId}", space: {
                desc: "upgraded",
                type:"COLLABORATION_ROOM",
                facility:"ZZZZ"
            }) {
                id,
                type,
                desc,
                createdAt,
                updatedAt
            }
        }`;
        await expect(client.mutate({
            mutation: updateSpace
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to save a space, facility should not exist", async () => {
        const saveSpace = gql`
        mutation {
            saveSpace(space: {
                desc: "space description",
                type:"CONFERENCE_ROOM",
                facility:"ZZZZ"
                }) {
                    id,
                    type,
                    desc,
                    createdAt,
                    updatedAt
                }
            }`;
        await expect(client.mutate({
            mutation: saveSpace
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to save a space, space should already exist", async () => {
        const saveSpace = gql`
        mutation {
            saveSpace(space: {
                desc: "updated description",
                type:"COLLABORATION_ROOM",
                facility:"HMLT"
                }) {
                    id,
                    type,
                    desc,
                    createdAt,
                    updatedAt
                }
            }`;
        await expect(client.mutate({
            mutation: saveSpace
        })).rejects.toThrowError("GraphQL error: Space already exists");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to save a space, space type should not exist", async () => {
        const saveSpace = gql`
        mutation {
            saveSpace(space: {
                desc: "space description",
                type:"KITCHEN",
                facility:"HMLT"
                }) {
                    id,
                    type,
                    desc,
                    createdAt,
                    updatedAt
                }
            }`;
        await expect(client.mutate({
            mutation: saveSpace
        })).rejects.toThrowError("GraphQL error: SpaceType does not exist");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should error to save a space, variables should not contain blank spaces only", async () => {
        const saveSpace = gql`
        mutation {
            saveSpace(space: {
                desc: "   ",
                type:"TEAM_ROOM",
                facility:"BOOZ"
                }) {
                    id,
                    type,
                    desc,
                    createdAt,
                    updatedAt
                }
            }`;
        await expect(client.mutate({
            mutation: saveSpace
        })).rejects.toThrowError("GraphQL error: desc should not contain blank spaces only.");
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should not find spaces, spaces should not exist", async () => {

        const allSpaces = gql`
        query {
            allSpaces(facilityId: "ZZZZ") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allSpaces).toBeDefined();
        expect(data.allSpaces).not.toBeNull();
        expect(data.allSpaces).toHaveLength(0);
    });
});

describe("Space Resolver Tests", () => {
    it("Resolver should not find spaces, spaces should not exist", async () => {
        const allSpaces = gql`
        query {
            space(name: "KITCHEN", facilityId: "${hamilton._id}") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allSpaces });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.space).toBeDefined();
        expect(data.space).not.toBeNull();
        expect(data.space).toHaveLength(0);
    });
});