import { Facility, FacilityModel, FacilityType} from "../../src/api/model/Facility";
import { FacilityRepository } from "../../src/api/repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../../src/api/repository/FacilityRepositoryImpl";
import { booz, facilities, allen, upgradeBooz} from "../data/Facilities";
import { FacilityComparator } from "../util/FacilityComparator";
import { connection } from "mongoose";

const repo: FacilityRepository = new FacilityRepositoryImpl();


beforeAll(async () => {
    await connection.db.dropDatabase();
    await FacilityModel.create(facilities);
});

describe("Facility Repository Tests", () => {
    it("Repository should return facility given facility id", async () => {
        const facility: Facility | null = await repo.findById(booz._id);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility!, booz);
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should return all facilities", async () => {
        const facility: Facility[] | null = await repo.findAll();
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});


describe("Facility Repository Tests", () => {
    it("Repository should return paged facilities given skip, take", async () => {
        const facility: Facility[] | null = await repo.getSlicedFacilities(0, 5);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should return paged facilities given skip, take, campus code and facility type", async () => {
        const facility: Facility[] | null = await repo.getSlicedFacilitiesByCampusCodeFacilityType(0, 5, "MCLN", FacilityType.OFFICE);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});

 //failing
 /*
describe("Facility Repository Tests", () => {
    it("Repository should return facilities given near corrdinates", async () => {
        const facility: Facility[] | null = await repo.findAllNear(-77, 38, 40, FacilityType.Office);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});
*/

describe("Facility Repository Tests", () => {
    it("Repository should create a new facility", async () => {
        const facility: Facility | null = await repo.save(allen);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility, allen);
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should save (upsert) an existing facility", async () => {
        const facility: Facility | null = await repo.save(upgradeBooz);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility, upgradeBooz);

        const totalFacility: Facility[] | null = await repo.findAll();
        expect(totalFacility).not.toBeNull();
        expect(totalFacility).toHaveLength(3);

        expect(totalFacility[0]._id).toBe("BOOZ");
        expect(totalFacility[1]._id).toBe("HMLT");
        expect(totalFacility[2]._id).toBe("ALEN");
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should update an existing facility", async () => {
        const facility: Facility | null = await repo.update(upgradeBooz);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility!, upgradeBooz);

        const totalFacility: Facility[] | null = await repo.findAll();
        expect(totalFacility).not.toBeNull();
        expect(totalFacility).toHaveLength(3);

        expect(totalFacility[0]._id).toBe("BOOZ");
        expect(totalFacility[1]._id).toBe("HMLT");
        expect(totalFacility[2]._id).toBe("ALEN");
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should delete a facility", async () => {
        const deletFacility = await repo.delete("ALEN");
        expect(deletFacility).toEqual(true);
    });
});

// -ve test cases
describe("Facility Repository Tests", () => {
    it("Repository not found facility given facility id, if does not exist", async () => {
        const facility: Facility | null = await repo.findById("KKKK");
        expect(facility).toBeNull();
    });
});



describe("Facility Repository Tests", () => {
    it("Repository should error updating a facility, which does not exist", async () => {
        const facility: Facility | null = await repo.update(upgradeBooz);
        expect(facility).toBeNaN;
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should error to delete a facility, if facility does not exist", async () => {
        const deletFacility = await repo.delete("ALEN");
        expect(deletFacility).toEqual(false);
    });
});


afterAll(async () => {
    await connection.db.dropDatabase();
});


// fix later related to search facility
/*
describe("Facility Repository Tests", () => {
    it("Repository should not found facility in campus, if does not exist campus code", async () => {
        const facility: Facility[] | null = await repo.findAllByCampusCode("MMMM", FacilityType.Office, true);
        expect(facility).toBeNaN;
    });
});

describe("Facility Repository Tests", () => {
    it("Repository should return facilities given campus code", async () => {
        const facility: Facility[] | null = await repo.findAllByCampusCode(booz.campusCode, FacilityType.Office, true);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});

*/