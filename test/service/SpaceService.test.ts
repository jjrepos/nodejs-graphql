import { Space, SpaceModel } from "../../src/api/model/Space";
import { SpaceService } from "../../src/api/service/SpaceService";
import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";
import { SpaceComparator } from "../util/SpaceComparator";

import { spacesData, upgradeCollaborationRoomHamilton, teamRoomHamilton, conferenceRoomHamilton, blankSpace } from "../data/Spaces";
import { spaceTypes, collaborationRoom, teamRoom, conferenceRoom } from "../data/SpaceTypes";
import { facilities, hamilton} from "../data/Facilities";
import { SpaceInput } from "../../src/api/resolver/types/input/SpaceInput";

import { connection } from "mongoose";

const service: SpaceService = new SpaceService();

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

describe("Space Service Tests", () => {
    it("Service should return spaces given facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] = await service.getAllSpaces(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(2);
        SpaceComparator.compareAllFields(spaceResult[0], hamiltonSpace, teamRoom);
    });
});

describe("Space Service Tests", () => {
    it("Service should return spaces with facility given facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] = await service.getAllSpacesWithFacility(hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(2);
        SpaceComparator.compareAllFieldsWithFacility(spaceResult[0], hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Service Tests", () => {
    it("Service should return spaces given type name and facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] | null = await service.getSpace(teamRoom.name, hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        SpaceComparator.compareAllFields(spaceResult![0], hamiltonSpace, teamRoom);
    });
});

describe("Space Service Tests", () => {
    it("Service should return spaces with facility given type name and facility id", async () => {
        let hamiltonSpace: Space = plainToClass(Space, teamRoomHamilton);
        const spaceResult: Space[] | null = await service.getSpaceWithFacility(teamRoom.name, hamilton._id);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        SpaceComparator.compareAllFieldsWithFacility(spaceResult![0], hamiltonSpace, hamilton, teamRoom);
    });
});

describe("Space Service Tests", () => {
    it("Service should create a new space", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, conferenceRoomHamilton);
        hamiltonSpaceInput.type = "CONFERENCE_ROOM";
        hamiltonSpaceInput.facility = "HMLT";
        let hamiltonSpace: Space = plainToClass(Space, conferenceRoomHamilton);
        const space: Space | null = await service.save(hamiltonSpaceInput);
        expect(space).not.toBeNull();
        SpaceComparator.compareAllFields(space, hamiltonSpace, conferenceRoom!);
    });
});

describe("Space Service Tests", () => {
    it("Service should update an existing space", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = "HMLT";
        hamiltonSpaceInput.type = "COLLABORATION_ROOM";
        let hamiltonSpace: Space = plainToClass(Space, upgradeCollaborationRoomHamilton);
        const spaceResult: Space[] | null = await service.getSpace(collaborationRoom!.name, hamiltonSpaceInput.facility);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        expect(spaceResult![0]).not.toBeNull();

        const updateResult: Space | null = await service.update(spaceResult![0]._id.toString(), hamiltonSpaceInput);
        expect(updateResult).not.toBeNull();
        SpaceComparator.compareAllFields(updateResult!, hamiltonSpace, collaborationRoom!);
    });
});

describe("Space Service Tests", () => {
    it("Service should delete an existing space", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, conferenceRoomHamilton);
        hamiltonSpaceInput.facility = "HMLT";
        const spaceResult: Space[] | null = await service.getSpace(conferenceRoom!.name, hamiltonSpaceInput.facility);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        
        const space: Boolean = await service.delete(spaceResult![0]._id.toString());
        expect(space).not.toBeNull();
        expect(space).toBe(true);

        const postDeleteSpaceResult: Space[] | null = await service.getSpace(conferenceRoom!.name, hamiltonSpaceInput.facility);
        expect(postDeleteSpaceResult).not.toBeNull();
        expect(postDeleteSpaceResult).toHaveLength(0);
    });
});

//all -ve test cases
describe("Space Service Tests", () => {
    it("Service should error to delete a space, space should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete space 5f05d1474b5dcbb405111935. Space not found.");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to update a space, space should not exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = "HMLT";
        hamiltonSpaceInput.type = "COLLABORATION_ROOM";
        await expect(service.update("5f05d1474b5dcbb405111935", hamiltonSpaceInput!) 
        ).rejects.toThrowError("Unable to update space 5f05d1474b5dcbb405111935. Space not found.");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to update a space, space type should not exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = "HMLT";
        const spaceResult: Space[] | null = await service.getSpace(collaborationRoom!.name, hamiltonSpaceInput.facility);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        expect(spaceResult![0]).not.toBeNull();
        hamiltonSpaceInput.type = "KITCHEN";
        
        await expect(service.update(spaceResult![0]._id.toString(), hamiltonSpaceInput)
        ).rejects.toThrowError("SpaceType does not exist");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to update a space, facility should not exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = "HMLT";
        const spaceResult: Space[] | null = await service.getSpace(collaborationRoom!.name, hamiltonSpaceInput.facility);
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(1);
        expect(spaceResult![0]).not.toBeNull();
        hamiltonSpaceInput.facility = "ZZZZ";
        
        await expect(service.update(spaceResult![0]._id.toString(), hamiltonSpaceInput)
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to save a space, facility should not exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, conferenceRoomHamilton);
        hamiltonSpaceInput.facility = "ZZZZ";
        await expect(service.save(hamiltonSpaceInput)
        ).rejects.toThrowError("Facility does not exist.");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to save a space, space should already exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = hamilton._id!;
        hamiltonSpaceInput.type = collaborationRoom.name;
        await expect(service.save(hamiltonSpaceInput)
        ).rejects.toThrowError("Space already exists");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to save a space, space type should not exist", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, upgradeCollaborationRoomHamilton);
        hamiltonSpaceInput.facility = hamilton._id;
        hamiltonSpaceInput.type = "KITCHEN";
        await expect(service.save(hamiltonSpaceInput)
        ).rejects.toThrowError("SpaceType does not exist");
    });
});

describe("Space Service Tests", () => {
    it("Service should error to save a space, variables should not contain blank spaces only", async () => {
        let hamiltonSpaceInput: SpaceInput = plainToClass(SpaceInput, blankSpace);
        await expect(service.save(hamiltonSpaceInput)
        ).rejects.toThrowError("desc should not contain blank spaces only.");
    });
});

describe("Space Service Tests", () => {
    it("Service should not find a space, space should not exist with given facility id", async () => {
        const spaceResult: Space[] = await service.getAllSpaces("ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Service Tests", () => {
    it("Service should not find a space, space should not exist with given facility id", async () => {
        const spaceResult: Space[] = await service.getAllSpacesWithFacility("ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Service Tests", () => {
    it("Service should not find a space, space should not exist with given space type and facility id", async () => {
        const spaceResult: Space[] | null = await service.getSpace("KITCHEN", "ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});

describe("Space Service Tests", () => {
    it("Service should not find a space, space should not exist with given space type and facility id", async () => {
        const spaceResult: Space[] | null = await service.getSpaceWithFacility("KITCHEN", "ZZZZ");
        expect(spaceResult).not.toBeNull();
        expect(spaceResult).toHaveLength(0);
    });
});