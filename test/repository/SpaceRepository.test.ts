import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Space, SpaceModel } from "../../src/api/model/Space";
import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { SpaceRepository } from "../../src/api/repository/SpaceRepository";
import { SpaceRepositoryImpl } from "../../src/api/repository/SpaceRepositoryImpl";
import { facilities, hamilton } from "../data/Facilities";
import { spacesData, upgradeCollaborationRoomHamilton, teamRoomHamilton, conferenceRoomHamilton } from "../data/Spaces";
import { spaceTypes, collaborationRoom, teamRoom, conferenceRoom } from "../data/SpaceTypes";
import { SpaceComparator } from "../util/SpaceComparator";

const repo: SpaceRepository = new SpaceRepositoryImpl();

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

describe("Space Repository Tests", () => {
    it("Repository should return spaces given facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] = await repo.findByFacilityId(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(2);
        SpaceComparator.compareAllFields(spaceResult[0], hamiltonSpace, teamRoom);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should return spaces with facility given facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] = await repo.findWithFacilityByFacilityId(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(2);
        SpaceComparator.compareAllFieldsWithFacility(spaceResult[0], hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should return spaces given type name and facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] | null = await repo.findByTypeFacilityId(teamRoom.name, hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        SpaceComparator.compareAllFields(spaceResult![0], hamiltonSpace, teamRoom);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should return spaces with facility given type name and facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] | null = await repo.findWithFacilityByTypeFacilityId(teamRoom.name, hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        SpaceComparator.compareAllFieldsWithFacility(spaceResult![0], hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should create a new space", async () => {
        let hamiltonSpace: Space = plainToClass(Space, conferenceRoomHamilton);
        let conferenceRoomType: SpaceType | null = await SpaceTypeModel.findOne({ name: "CONFERENCE_ROOM" }).exec();
        let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();
        expect(hamiltonSpace).not.toBeNull();
        expect(conferenceRoomType).not.toBeNull();
        expect(hamilton).not.toBeNull();

        hamiltonSpace.facility = hamilton!;
        hamiltonSpace.type = conferenceRoomType!;
        const space: Space | null = await repo.save(hamiltonSpace);
        expect(space).not.toBeNull();
        SpaceComparator.compareAllFieldsWithFacility(space, hamiltonSpace, hamilton!, conferenceRoomType!);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should update an existing space", async () => {
        let hamiltonSpace: Space = plainToClass(Space, upgradeCollaborationRoomHamilton);
        const spaceResult: Space[] = await repo.findByFacilityId(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(3);

        const space: Space | null = await repo.update(spaceResult[1]._id.toString(), hamiltonSpace);
        expect(space).not.toBeNull();
        SpaceComparator.compareAllFields(space!, hamiltonSpace, collaborationRoom!);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should delete an existing space", async () => {
        const spaceResult: Space[] = await repo.findByFacilityId(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(3);

        const space: Boolean = await repo.delete(spaceResult[0]._id.toString());
        expect(space).not.toBeNull();
        expect(space).toBe(true);

        const deletedSpaceResult: Space[] = await repo.findByFacilityId(hamilton._id);
        expect(deletedSpaceResult).not.toBeNull();
        expect(deletedSpaceResult).toHaveLength(2);
    });
});

// -ve test cases
describe("Space Repository Tests", () => {
    it("Repository should error to delete a space, if space does not exist", async () => {
        const space: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(space).not.toBeNull();
        expect(space).toBe(false);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should error to update a space, if space does not exist", async () => {
        let hamiltonSpace: Space = plainToClass(Space, upgradeCollaborationRoomHamilton);
        const space: Space | null = await repo.update("5f05d1474b5dcbb405111935", hamiltonSpace);
        expect(space).toBeNull();
    });
});

describe("Space Repository Tests", () => {
    it("Repository should not find a space, space should not exist with given facility id", async () => {
        const spaceResult: Space[] = await repo.findByFacilityId("ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should not find a space, space should not exist with given facility id", async () => {
        const spaceResult: Space[] = await repo.findWithFacilityByFacilityId("ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should not find a space, space should not exist with given space type name and facility id", async () => {
        const spaceResult: Space[] | null = await repo.findByTypeFacilityId("MEETING_ROOM", "ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Repository Tests", () => {
    it("Repository should not find a space, space should not exist with given space type name and facility id", async () => {
        const spaceResult: Space[] | null = await repo.findWithFacilityByTypeFacilityId("MEETING_ROOM", "ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});