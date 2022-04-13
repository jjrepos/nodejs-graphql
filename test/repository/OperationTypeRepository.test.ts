import { OperationType, OperationTypeModel } from "../../src/api/model/OperationType";
import { OperationTypeRepository } from "../../src/api/repository/OperationTypeRepository";
import { OperationTypeRepositoryImpl } from "../../src/api/repository/OperationTypeRepositoryImpl";

import { operationTypes, distribution, distributionTest, cleaningUpdate } from "../data/OperationTypes";
import { OperationTypeComparator } from "../util/OperationTypeComparator";
import { connection } from "mongoose";

const repo: OperationTypeRepository = new OperationTypeRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await OperationTypeModel.create(operationTypes);
});

describe("OperationType Repository Tests", () => {
    it("Repository should return operation type given operation type name", async () => {
        const operationType: OperationType | null = await repo.find(distribution.name);
        expect(operationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(operationType!, distribution);
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should return all operation types", async () => {
        const operationTypes: OperationType[] | null = await repo.findAll();
        expect(operationTypes).not.toBeNull();
        expect(operationTypes).toHaveLength(9);
        OperationTypeComparator.compareAllFields(operationTypes[0], distribution);
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should create a new operation type", async () => {
        const operationType: OperationType | null = await repo.save(distributionTest);
        expect(operationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(operationType, distributionTest);
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should update an existing operation type", async () => {
        const operationType: OperationType | null = await repo.find(cleaningUpdate.name);
        expect(operationType).not.toBeNull();

        const updatedOperationType: OperationType | null = await repo.update(operationType!._id.toString(), cleaningUpdate!);
        expect(updatedOperationType).not.toBeNull();
        OperationTypeComparator.compareAllFields(updatedOperationType!, cleaningUpdate);
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should delete a operation type", async () => {
        const operationType: OperationType | null = await repo.find(distributionTest.name);
        expect(operationType).not.toBeNull();

        const deleteOperationType: boolean = await repo.delete(operationType!._id.toString());
        expect(deleteOperationType).not.toBeNull();
        expect(deleteOperationType).toEqual(true);
    });
});

//all -ve test cases
describe("OperationType Repository Tests", () => {
    it("Repository should error to delete a operation type, if operation type does not exist", async () => {
        const operationType: boolean = await repo.delete("5f05d1474b5dcbb405111935");
        expect(operationType).not.toBeNull();
        expect(operationType).toEqual(false);
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should error to update a operation type, if operation type does not exist", async () => {
        const operationType: OperationType | null = await repo.update("5f05d1474b5dcbb405111935", cleaningUpdate);
        expect(operationType).toBeNull();
    });
});

describe("OperationType Repository Tests", () => {
    it("Repository should error to find a operation type, operation type should not exist with given operation type name", async () => {
        const operationType: OperationType | null = await repo.find("CLEAN");
        expect(operationType).toBeNull();
    });
});