import { OperationType, OperationTypeModel } from "../../src/api/model/OperationType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { Operation, OperationModel } from "../../src/api/model/Operation";
import { operationTypes, cleaning, distribution} from "../data/OperationTypes";
import { operationsData, cleaningOperation, distributionOperationInput, updateDistributionOperationInput} from "../data/Operations";
import { facilities, booz} from "../data/Facilities";
import { OperationComparator } from "../util/OperationComparator";
import { plainToClass } from "class-transformer";
import { OperationRepositoryImpl } from "../../src/api/repository/OperationRepositoryImpl";
import { OperationRepository } from "../../src/api/repository/OperationRepository";

import { connection } from "mongoose";

const repo: OperationRepository = new OperationRepositoryImpl();

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

describe("Operation Repository Tests", () => {
    it("Repository should return operations given facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] = await repo.findByFacilityId(booz._id);
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult[0], boozOperation, cleaning);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should return operations with facility given facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        const operationResult: Operation[] = await repo.findWithFacilityByFacilityId("BOOZ");
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFieldsWithFacility(operationResult[0], boozOperation, cleaning, booz);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should return operations given operation type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        const operationResult: Operation[] | null = await repo.findByOperationTypeFacilityId(cleaning.name, booz._id);
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult![0], boozOperation, cleaning);
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should return operation given operation type id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let cleaningType: OperationType  | null = await OperationTypeModel.findOne({ name: "CLEANING_SERVICE" }).exec();
        let operationResult: Operation[] | null  = await repo.findByTypeId(cleaningType!._id.toString());
        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFields(operationResult![0], boozOperation, cleaning);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should return operations with facility given type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operationResult: Operation[] | null = await repo.findWithFacilityByOperationTypeFacilityId(cleaning.name, booz._id);

        expect(operationResult).not.toBeNull();
        expect(operationResult).toHaveLength(1);
        OperationComparator.compareAllFieldsWithFacility(operationResult![0], boozOperation, cleaning, booz);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should create a new operation", async () => {
        let operationInput: Operation = Operation.withInput(distributionOperationInput, distribution );
        let boozDistributionOperation: Operation = plainToClass(Operation, distributionOperationInput);
        let operation: Operation | null = await repo.save(operationInput);
        expect(operation).not.toBeNull();
        OperationComparator.compareAllFields(operation, boozDistributionOperation, distribution);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should update an existing operation", async () => {
        let operationInput: Operation = Operation.withInput(updateDistributionOperationInput, distribution );
        let boozDistributionOperation: Operation = plainToClass(Operation, updateDistributionOperationInput);
        let disOperationFound: Operation[] | null = await repo.findByOperationTypeFacilityId(distribution.name, booz._id);

        let updatedOperation: Operation | null = await repo.update(disOperationFound![0]._id.toString(), operationInput);
        expect(updatedOperation!).not.toBeNull();
        OperationComparator.compareAllFields(updatedOperation!, boozDistributionOperation, distribution);
    });
});


describe("Operation Repository Tests", () => {
    it("Repository should delete an existing operation", async () => {
        let disOperationFound: Operation[] | null = await repo.findByOperationTypeFacilityId(distribution.name, booz._id);
        let operation = await repo.delete(disOperationFound![0]._id.toString());
        expect(operation).not.toBeNull();
        expect(operation).toEqual(true);
    });
});


// -ve test cases
describe("Operation Repository Tests", () => {
    it("Repository should error to delete a operation, if operation does not exist", async () => {
        const operation = await repo.delete("5f05d1474b5dcbb405111935");
        expect(operation).not.toBeNull();
        expect(operation).toEqual(false);
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should error to update a operation, if operation does not exist", async () => {
        let operationInput: Operation = Operation.withInput(updateDistributionOperationInput, distribution);
        let boozDistributionOperation: Operation = plainToClass(Operation, operationInput);
        const operation: Operation | null = await repo.update("5f05d1474b5dcbb405111935", boozDistributionOperation);
        expect(operation).toBeNull();
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should not find a operation, operation should not exist with given facility id", async () => {
        const operationResponse: Operation[] = await repo.findByFacilityId("ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should not find a operation, operation should not exist with given operation type name and facility id", async () => {
        const operationResponse: Operation[] | null = await repo.findByOperationTypeFacilityId("DISTRIBUTION_SERVICE", "ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should not find a operation, operation should not exist with given operation type name and facility id", async () => {
        const operationResponse: Operation[] | null = await repo.findWithFacilityByOperationTypeFacilityId("DISTRIBUTION_SERVICE", "ZZZZ");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});

describe("Operation Repository Tests", () => {
    it("Repository should not find a operation, operation should not exist with given operation type id", async () => {
        const operationResponse: Operation[] | null = await repo.findByTypeId("5f05d1474b5dcbb405111935");
        expect(operationResponse).not.toBeNull();
        expect(operationResponse).toHaveLength(0);
    });
});
