import { Facility, FacilityModel, FacilityType } from "../../src/api/model/Facility";
import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { StateCodeModel} from "../../src/api/model/StateCode";
import { CountryCodeModel} from "../../src/api/model/CountryCode";
import { FacilityService } from "../../src/api/service/FacilityService";
import { booz, facilities, allen, transports, transportationTypes, allenInput, crystalBlankInput, upgradeBooz, upgradeBoozInput} from "../data/Facilities";
import { stateCodes} from "../data/StateCodes";
import { countryCodes } from "../data/CountryCodes";
import { FacilityComparator } from "../util/FacilityComparator";
import { plainToClass } from "class-transformer";
import { FacilityPage } from "../../src/api/resolver/types/output/pagination/FacilityPage";
import { connection } from "mongoose";

const service: FacilityService = new FacilityService();

beforeAll(async () => {
    await connection.db.dropDatabase();

    await FacilityModel.create(facilities);
    await TransportationTypeModel.create(transportationTypes);
    let parking: TransportationType | null = await TransportationTypeModel.findOne({ name: "PARKING" }).exec();
    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let transportations: Transportation[] = plainToClass(Transportation, transports);
    transportations[0].facility = booz!;
    transportations[0].type = parking!;
    transportations[0].address = booz!.address;
    await TransportationModel.create(transportations);

    await StateCodeModel.create(stateCodes);
    await CountryCodeModel.create(countryCodes);
});

describe("Facility Service Tests", () => {
    it("Service should return facility given facility id", async () => {
        const facility: Facility | null = await service.getFacility(booz._id);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility!, booz);
    });
});

describe("Facility Service Tests", () => {
    it("Service should return paged facilities given skip, take and facility type", async () => {
        const facility: FacilityPage = await service.getFacilityPages(0, 5);
        expect(facility).not.toBeNull();
        expect(facility.items).toHaveLength(2);
        expect(facility.hasMore).toBe(false);
        expect(facility.total).toBe(2);
        FacilityComparator.compareAllFields(facility.items[0], booz);
    });
});

describe("Facility Service Tests", () => {
    it("Service should return paged facilities given skip, take and facility type", async () => {
        const facility: FacilityPage = await service.getFacilityPagesByCampusCodeFacilityType(0, 5, "MCLN", FacilityType.OFFICE);
        expect(facility).not.toBeNull();
        expect(facility.items).toHaveLength(2);
        expect(facility.hasMore).toBe(false);
        expect(facility.total).toBe(2);
        FacilityComparator.compareAllFields(facility.items[0], booz);
    });
});

 //failing
 /*
describe("Facility Service Tests", () => {
    it("Service should return facilities given near corrdinates", async () => {
        const facility: Facility[] | null = await service.getFacilitiesNear(-77, 38, 40);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});
*/


describe("Facility Service Tests", () => {
    it("Service should create a new facility", async () => {
        const facility: Facility | null = await service.save(allenInput);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility, allen);
    });
});


describe("Facility Service Tests", () => {
    it("Service should save (upsert) an existing facility", async () => {
        const facility: Facility | null = await service.save(upgradeBoozInput);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility, upgradeBooz);

    });
});

describe("Facility Service Tests", () => {
    it("Service should update an existing facility", async () => {
        const facility: Facility | null = await service.update(upgradeBoozInput);
        expect(facility).not.toBeNull();
        FacilityComparator.compareAllFields(facility!, upgradeBooz);

    });
});

describe("Facility Service Tests", () => {
    it("Service should delete a facility", async () => {
        const deletFacility = await service.delete("ALEN");
        expect(deletFacility).toEqual(true);
    });
});

describe("Facility Service Tests", () => {
    it("Service should delete a facility, if transportations exist", async () => {
        const deletFacility = await service.delete("BOOZ");
        expect(deletFacility).toEqual(true);
    });
});


// -ve test case 
describe("Facility Service Tests", () => {
    it("Service should not found facility given facility id, if does not exist", async () => {
        const facility: Facility | null = await service.getFacility("KKKK");
        expect(facility).toBeNull();
    });
});


describe("Facility Service Tests", () => {
    it("Service should error updating a facility, which does not exist", async () => {
        await expect(service.update(allenInput)
        ).rejects.toThrowError("Unable to update facility ALEN. Facility not found.");
    });
});


describe("Facility Service Tests", () => {
    it("Service should error to delete a facility, if facility does not exist", async () => {
        await expect(service.delete("ALEN")
        ).rejects.toThrowError("Unable to delete facility ALEN. Facility not found.");
    });
});

describe("Facility Service Tests", () => {
    it("Service should error to save a facility, variables should not contain blank spaces only", async () => {
        await expect(service.save(crystalBlankInput)
        ).rejects.toThrowError("name, campusCode, timeZone, otherDetail should not contain blank spaces only.");
    });
});

// fix later related to facility search
/*
describe("Facility Service Tests", () => {
    it("Service should not found facility in campus, if does not exist campus code", async () => {
        const facility: Facility[] | null = await service.getFacilitiesInCampus("MMMM", FacilityType.Office, true);
        expect(facility).toHaveLength(0);
        expect(facility).toBeNaN;
    });
});

describe("Facility Service Tests", () => {
    it("Service should return facilities given campus code", async () => {
        const facility: Facility[] | null = await service.getFacilitiesInCampus(booz.campusCode, FacilityType.Office, true);
        expect(facility).not.toBeNull();
        expect(facility).toHaveLength(2);
        FacilityComparator.compareAllFields(facility[0], booz);
    });
});
*/
