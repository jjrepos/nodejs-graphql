import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { SpaceTypeService } from "../../src/api/service/SpaceTypeService";
import { blankType, spaceTypes, collaborationRoom, conferenceRoom, upgradeCollaborationRoom } from "../data/SpaceTypes";
import { SpaceTypeComparator } from "../util/SpaceTypeComparator";

import { Space, SpaceModel } from "../../src/api/model/Space";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { plainToClass } from "class-transformer";

import { spacesData } from "../data/Spaces";
import { facilities} from "../data/Facilities";

import { connection } from "mongoose";

const service: SpaceTypeService = new SpaceTypeService();

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

describe("SpaceType Service Tests", () => {
    it("Service should return space type given type name", async () => {
        const spaceType: SpaceType | null = await service.getSpaceType(collaborationRoom.name);
        expect(spaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(spaceType!, collaborationRoom);
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should return all space types", async () => {
        const spaceTypes: SpaceType[] | null = await service.getAllSpaceTypes();
        expect(spaceTypes).not.toBeNull();
        expect(spaceTypes).toHaveLength(2);
        SpaceTypeComparator.compareAllFields(spaceTypes[0], collaborationRoom);
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should create a new space type", async () => {
        const spaceType: SpaceType | null = await service.save(conferenceRoom);
        expect(spaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(spaceType, conferenceRoom);
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should update an existing space type", async () => {
        const spaceType: SpaceType | null = await service.getSpaceType(collaborationRoom.name);
        expect(spaceType).not.toBeNull();

        spaceType!.name = upgradeCollaborationRoom.name;
        spaceType!.desc = upgradeCollaborationRoom.desc;
        const updatedSpaceType = await service.update(spaceType!._id.toHexString(), spaceType!);
        expect(updatedSpaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(updatedSpaceType!, upgradeCollaborationRoom);

        const spaceTypes: SpaceType[] | null = await service.getAllSpaceTypes();
        expect(spaceTypes).not.toBeNull();
        expect(spaceTypes).toHaveLength(3);
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should delete a space type", async () => {
        const spaceType: SpaceType | null = await service.getSpaceType(conferenceRoom.name);
        expect(spaceType).not.toBeNull();

        await service.delete(spaceType!._id.toString());
        const deletedSpaceType: SpaceType | null = await service.getSpaceType(conferenceRoom.name);
        expect(deletedSpaceType).toBeNull();
    });
});

//all -ve test cases
describe("SpaceType Service Tests", () => {
    it("Service should error to delete a space type, space type should have associated spaces", async () => {
        const spaceType: SpaceType | null = await service.getSpaceType(upgradeCollaborationRoom.name);
        expect(spaceType).not.toBeNull();

        await expect(service.delete(spaceType!._id.toString())
        ).rejects.toThrowError("Cannot delete type - has associated spaces");
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should error to delete a space type, space type should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete space type 5f05d1474b5dcbb405111935. Space type not found.");
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should error to update a space type, space type should not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405111935", upgradeCollaborationRoom!) 
        ).rejects.toThrowError("Unable to update space type 5f05d1474b5dcbb405111935. Space type not found.");
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should error to save a space type, space type should already exist", async () => {
        await expect(service.save(upgradeCollaborationRoom)
        ).rejects.toThrowError("Space type already exists");
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should error to save a space type, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankType)
        ).rejects.toThrowError("name, desc should not contain blank spaces only.");
    });
});

describe("SpaceType Service Tests", () => {
    it("Service should not find space type, space type should not exist", async () => {
        const spaceType: SpaceType | null = await service.getSpaceType("KITCHEN");
        expect(spaceType).toBeNull();
    });
});