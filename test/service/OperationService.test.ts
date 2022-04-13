import { OperationType, OperationTypeModel } from "../../src/api/model/OperationType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { Operation, OperationModel } from "../../src/api/model/Operation";
import { operationTypes, cleaning, distribution} from "../data/OperationTypes";
import { operationsData, cleaningOperation, distributionOperationInput, 
    updateDistributionOperationInput, blankOperationInput} from "../data/Operations";
import { facilities, booz} from "../data/Facilities";
import { OperationComparator } from "../util/OperationComparator";
import { plainToClass } from "class-transformer";
import { OperationService } from "../../src/api/service/OperationService";
import { connection } from "mongoose";
const service: OperationService = new OperationService();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await OperationTypeModel.create(operationTypes);
    await FacilityModel.create(facilities);

    let cleaning: OperationType  | null = await OperationTypeModel.findOne({ name: "CLEANING_SERVICE" }).exec();
    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let operations: Operation[] = plainToClass(Operation, operationsData);

    operations[0].facility = booz!;
    operations[0].type = cleaning!;
    await OperationModel.create(operations);
    
});

describe("Operation Service Tests", () => {
    it("Service should return operations given facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] = await service.getAllOperations(booz._id);
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult[0], boozOperation, cleaning);
    });
});


describe("Operation Service Tests", () => {
    it("Service should return operations with facility given facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] = await service.getAllOperationsWithFacility("BOOZ");
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFieldsWithFacility(operationResult[0], boozOperation, cleaning, booz);
    });
});


describe("Operation Service Tests", () => {
    it("Service should return operations given operation type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] | null = await service.getOperation(cleaning.name, booz._id);
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult![0], boozOperation, cleaning);
    });
});

describe("Operation Service Tests", () => {
    it("Service should return operation given operation type id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let cleaningType: OperationType  | null = await OperationTypeModel.findOne({ name: "CLEANING_SERVICE" }).exec();
        let operationResult: Operation[] | null  = await service.getOperationWithTypeId(cleaningType!._id.toString());
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult![0], boozOperation, cleaning);
    });
});


describe("Operation Service Tests", () => {
    it("Service should return operations with facility given type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] | null = await service.getOperationWithFacility(cleaning.name, booz._id);

        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFieldsWithFacility(operationResult![0], boozOperation, cleaning, booz);
    });
});


describe("Operation Service Tests", () => {
    it("Service should create a new operation", async () => {
        let boozDistributionOperation: Operation = plainToClass(Operation, distributionOperationInput);
        let operation: Operation | null = await service.save(distributionOperationInput);
        expect(operation).not.toBeNull();
        OperationComparator.compareAllFields(operation, boozDistributionOperation, distribution);
    });
});


describe("Operation Service Tests", () => {
    it("Service should update an existing operation", async () => {
        let boozDistributionOperation: Operation = plainToClass(Operation, updateDistributionOperationInput);
        let disOperationFound: Operation[] | null = await service.getOperationWithFacility(distribution.name, booz._id);

        let updatedOperation: Operation | null = await service.update(disOperationFound![0]._id.toString(), updateDistributionOperationInput);
        expect(updatedOperation!).not.toBeNull();
        OperationComparator.compareAllFields(updatedOperation!, boozDistributionOperation, distribution);
    });
});


describe("Operation Service Tests", () => {
    it("Service should delete an existing operation", async () => {
        let disOperationFound: Operation[] | null = await service.getOperation(distribution.name, booz._id);
        let operation = await service.delete(disOperationFound![0]._id.toString());
        expect(operation).toEqual(true);
    });
});


// -ve test cases
describe("Operation Service Tests", () => {
    it("Service should error to delete a operation, if operation does not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405111935")
        ).rejects.toThrowError("Unable to delete operation. Operation not found.");
    });
});

describe("Operation Service Tests", () => {
    it("Service should error to update a operation, if operation does not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405111935", updateDistributionOperationInput)
        ).rejects.toThrowError("Unable to update operation. Operation not found.");
    });
});

describe("Operation Service Tests", () => {
    it("Service should not find a operation, operation should not exist with given facility id", async () => {
        const operationResponse: Operation[] = await service.getAllOperations("ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Service Tests", () => {
    it("Service should not find a operation, operation should not exist with given operation type name and facility id", async () => {
        const operationResponse: Operation[] | null = await service.getOperationWithFacility("DISTRIBUTION_SERVICE", "ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Service Tests", () => {
    it("Service should not find a operation, operation should not exist with given operation type name and facility id", async () => {
        const operationResponse: Operation[] | null = await service.getOperationWithFacility("DISTRIBUTION_SERVICE", "ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Service Tests", () => {
    it("Service should not find a operation, operation should not exist with given operation type id", async () => {
        const operationResponse: Operation[] | null = await service.getOperationWithTypeId("5f05d1474b5dcbb405111935");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Service Tests", () => {
    it("Service should error to save a operation, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankOperationInput)
        ).rejects.toThrowError("desc, poc, email, phone, room, url should not contain blank spaces only.");
    });
});