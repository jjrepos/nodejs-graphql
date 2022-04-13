import { SpaceType, SpaceTypeModel } from "../../src/api/model/SpaceType";
import { SpaceTypeRepository } from "../../src/api/repository/SpaceTypeRepository";
import { SpaceTypeRepositoryImpl } from "../../src/api/repository/SpaceTypeRepositoryImpl";
import { spaceTypes, collaborationRoom, conferenceRoom, upgradeCollaborationRoom } from "../data/SpaceTypes";
import { SpaceTypeComparator } from "../util/SpaceTypeComparator";

import { connection } from "mongoose";

const repo: SpaceTypeRepository = new SpaceTypeRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await SpaceTypeModel.create(spaceTypes);
});

describe("SpaceType Repository Tests", () => {
    it("Repository should return space type given space type name", async () => {
        const spaceType: SpaceType | null = await repo.find(collaborationRoom.name);
        expect(spaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(spaceType!, collaborationRoom);
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should return all space types", async () => {
        const spaceTypes: SpaceType[] | null = await repo.findAll();
        expect(spaceTypes).not.toBeNull();
        expect(spaceTypes).toHaveLength(2);
        SpaceTypeComparator.compareAllFields(spaceTypes[0], collaborationRoom);
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should create a new space type", async () => {
        const spaceType: SpaceType | null = await repo.save(conferenceRoom);
        expect(spaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(spaceType, conferenceRoom);
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should update an existing space type", async () => {
        const spaceType: SpaceType | null = await repo.find(collaborationRoom.name);
        expect(spaceType).not.toBeNull();

        spaceType!.name = upgradeCollaborationRoom.name;
        spaceType!.desc = upgradeCollaborationRoom.desc;
        const updatedSpaceType: SpaceType | null = await repo.update(spaceType!._id.toString(), spaceType!);
        expect(updatedSpaceType).not.toBeNull();
        SpaceTypeComparator.compareAllFields(updatedSpaceType!, upgradeCollaborationRoom);

        const spaceTypes: SpaceType[] | null = await repo.findAll();
        expect(spaceTypes).not.toBeNull();
        expect(spaceTypes).toHaveLength(3);
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should delete a space type", async () => {
        const spaceType: SpaceType | null = await repo.find(conferenceRoom.name);
        expect(spaceType).not.toBeNull();

        const deleteSpaceType: Boolean = await repo.delete(spaceType!._id.toString());
        expect(deleteSpaceType).not.toBeNull();
        expect(deleteSpaceType).toBe(true);

        const deletedSpaceType: SpaceType | null = await repo.find(conferenceRoom.name);
        expect(deletedSpaceType).toBeNull();
    });
});

//all -ve test cases
describe("SpaceType Repository Tests", () => {
    it("Repository should error to delete a space type, if space type does not exist", async () => {
        const spaceType: Boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(spaceType).not.toBeNull();
        expect(spaceType).toBe(false);
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should error to update a space type, if space type does not exist", async () => {
        const spaceType: SpaceType | null = await repo.update("5f05d1474b5dcbb405111935", upgradeCollaborationRoom);
        expect(spaceType).toBeNull();
    });
});

describe("SpaceType Repository Tests", () => {
    it("Repository should error to find a space type, space type should not exist with given space type name", async () => {
        const spaceType: SpaceType | null = await repo.find("KITCHEN");
        expect(spaceType).toBeNull();
    });
});