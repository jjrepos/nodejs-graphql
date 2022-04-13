import { OperationType, OperationTypeModel } from "../../src/api/model/OperationType";
import { OperationTypeService } from "../../src/api/service/OperationTypeService";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { Operation, OperationModel } from "../../src/api/model/Operation";
import { operationTypes, distribution, distributionTest, cleaningUpdate, reception, blankOperationType } from "../data/OperationTypes";
import { operationsData} from "../data/Operations";
import { facilities} from "../data/Facilities";
import { OperationTypeComparator } from "../util/OperationTypeComparator";
import { plainToClass } from "class-transformer";
import { connection } from "mongoose";

const service: OperationTypeService = new OperationTypeService();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await OperationTypeModel.create(operationTypes);
    await FacilityModel.create(facilities);

    let distribution: OperationType  | null = await OperationTypeModel.findOne({ name: "DISTRIBUTION_SERVICE" }).exec();
    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let operations: Operation[] = plainToClass(Operation, operationsData);

    operations[0].facility = booz!;
    operations[0].type = distribution!;
    OperationModel.create(operations);
    
});

describe("OperationType Service Tests", () => {
    it("Service should return operation type given type name", async () => {
        const operationType: OperationType | null = await service.getOperationType(reception.name);
        expect(operationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(operationType!, reception);
    });
});

describe("OperationType Service Tests", () => {
    it("Service should return all operation types", async () => {
        let operationTypes: OperationType[] | null = await service.getAllOperationTypes();
        expect(operationTypes).not.toBeNull();
        expect(operationTypes).toHaveLength(9);
        OperationTypeComparator.compareAllFields(operationTypes[0], distribution);
    });
});

describe("OperationType Service Tests", () => {
    it("Service should create a new operation type", async () => {
        let operationType: OperationType | null = await service.save(distributionTest);
        expect(operationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(operationType, distributionTest);
    });
});

describe("OperationType Service Tests", () => {
    it("Service should update an existing operation type", async () => {
        let operationType: OperationType | null  = await service.getOperationType(cleaningUpdate.name);
        expect(operationType).not.toBeNull();

        let updatedOperationType = await service.update(operationType!._id.toHexString(), cleaningUpdate);
        expect(updatedOperationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(updatedOperationType, cleaningUpdate);
    });
});

describe("OperationType Service Tests", () => {
    it("Service should delete a operation type", async () => {
        let operationType: OperationType | null = await service.getOperationType(distributionTest.name);
        expect(operationType!).not.toBeNull();

        let deletedOperationType = await service.delete(operationType!._id.toString());
        expect(deletedOperationType).not.toBeNull();
        expect(deletedOperationType).toEqual(true);
    });
});

//all -ve test cases

describe("OperationType Service Tests", () => {
    it("Service should error to delete a operation type, operation type should have associated operations", async () => {
        const operationType: OperationType | null = await service.getOperationType(distribution.name);
        expect(operationType).not.toBeNull();

        await expect(service.delete(operationType!._id.toString())
        ).rejects.toThrowError("Cannot delete operation type - has associated operations");
    });
});


describe("OperationType Service Tests", () => {
    it("Service should error to delete a operation type, operation type should not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete operation type 5f05d1474b5dcbb405111935. Operation type not found.");
    });
});

describe("OperationType Service Tests", () => {
    it("Service should error to update a operation type, operation type should not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405111935", cleaningUpdate) 
        ).rejects.toThrowError("Unable to update operation type 5f05d1474b5dcbb405111935. Operation type not found.");
    });
});

describe("OperationType Service Tests", () => {
    it("Service should error to save a operation type, operation type should already exist", async () => {
        await expect(service.save(cleaningUpdate)
        ).rejects.toThrowError("Operation type already exists");
    });
});

describe("OperationType Service Tests", () => {
    it("Service should not find operation type, operation type should not exist", async () => {
        const operationType: OperationType | null = await service.getOperationType("CLEAN");
        expect(operationType).toBeNull();
    });
});

describe("OperationType Service Tests", () => {
    it("Service should error to save a operation type, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankOperationType)
        ).rejects.toThrowError("name, desc should not contain blank spaces only.");
    });
});