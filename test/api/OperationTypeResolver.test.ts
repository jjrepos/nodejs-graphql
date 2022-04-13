import { OperationTypeModel, OperationType } from "../../src/api/model/OperationType";
import { operationTypes, distribution, distributionTest, cleaning, cleaningUpdate } from "../data/OperationTypes";
import { OperationTypeComparator } from "../util/OperationTypeComparator";

import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";
import { connection } from "mongoose";

beforeAll(async () => {
    await connection.db.dropDatabase();
    await OperationTypeModel.create(operationTypes);
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should return all operation types", async () => {
        const operationTypes = gql`
        query {
            allOperationsTypes {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: operationTypes });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allOperationsTypes).toBeDefined();
        expect(data.allOperationsTypes).not.toBeNull();
        expect(data.allOperationsTypes).toHaveLength(9)
        let type: OperationType = data.allOperationsTypes[0];
        type.createdAt = new Date(type.createdAt);
        OperationTypeComparator.compareAllFields(type, distribution);
        expect(type.createdAt).toBeInstanceOf(Date);
    });
});


describe("OperationType Resolver Tests", () => {
    it("Resolver should return a operation type", async () => {
        const operationType = gql`
        query {
            operationType (name:"${distribution.name}") {
                id,
                name,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        const { data } = await client.query({ query: operationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        let type: OperationType = data.operationType;
        type.createdAt = new Date(type.createdAt);
        OperationTypeComparator.compareAllFields(type, distribution);
        expect(type.createdAt).toBeInstanceOf(Date);
    });
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should save operation type", async () => {
        const saveOperationType = gql`
        mutation somename {
            saveOperationType (operationType : {
                    name: "DISTRIBUTION_SERVICE_TEST",
                    desc: "Distribution Service Test"}) {
            id,name,desc,createdAt,updatedAt
            }
        }`;
        const { data } = await client.mutate({ mutation: saveOperationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        let type: OperationType = data.saveOperationType;
        OperationTypeComparator.compareAllFields(type, distributionTest);
    });
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should update operation type", async () => {

        const operationTypeByName = gql`
        query {
            operationType(name: "${cleaning.name}") {id}
        }`;
        let typeData = await client.query({ query: operationTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        let typeId = typeData.data.operationType.id;;

        const updateOperationType = gql`
        mutation somename {
            updateOperationType (id: "${typeId}", operationType :{
                name: "${cleaningUpdate.name}",
                desc: "${cleaningUpdate.desc}"}) {
            id,name,desc,createdAt,updatedAt
            }
        }`;
        const { data } = await client.mutate({ mutation: updateOperationType });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        let type: OperationType = data.updateOperationType;
        OperationTypeComparator.compareAllFields(type, cleaningUpdate);
    });
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should delete operation type", async () => {

        const operationTypeByName = gql`
        query {
            operationType(name: "${distributionTest.name}") {id}
        }`;
        let typeData = await client.query({ query: operationTypeByName });
        expect(typeData.data).toBeDefined();
        expect(typeData.data).not.toBeNull();
        let typeId = typeData.data.operationType.id;;

        const deleteOperationType = gql`
        mutation somename {
            deleteOperationType (id: "${typeId}") 
        }`;
        const { data } = await client.mutate({ mutation: deleteOperationType });
        expect(data).toBeDefined();
        expect(data.deleteOperationType).toEqual(true);
      
    });
});


// -ve cases 

describe("OperationType Resolver Tests", () => {
    it("Resolver should error to delete a operation type, operation type should not exist", async () => {
    const deleteOperationType = gql`
        mutation {
            deleteOperationType(id: "5f05d1474b5dcbb405111935")
        }`;
        await expect(client.mutate({
            mutation: deleteOperationType
        })).rejects.toThrowError("GraphQL error: Unable to delete operation type 5f05d1474b5dcbb405111935. Operation type not found.");
    });
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should error to update a operation type, operation type should not exist", async () => {
        const updateOperationType = gql`
        mutation {
            updateOperationType(id: "5f05d1474b5dcbb405111935",  operationType :{
                name: "${cleaningUpdate.name}",
                desc: "${cleaningUpdate.desc}"}) {
            id,name,desc,createdAt,updatedAt
            }
        }`;
        await expect(client.mutate({
            mutation: updateOperationType
        })).rejects.toThrowError("GraphQL error: Unable to update operation type 5f05d1474b5dcbb405111935. Operation type not found.");
    });
});

describe("OperationType Resolver Tests", () => {
    it("Resolver should error to save a operation type, operation type should already exist", async () => {
        const saveOperationType = gql`
        mutation {
         saveOperationType (operationType: {
                name: "${cleaningUpdate.name}",
                desc: "${cleaningUpdate.desc}"}) {
            id,name,desc,createdAt,updatedAt
        }
        }`;
        await expect(client.mutate({
            mutation: saveOperationType
        })).rejects.toThrowError("GraphQL error: Operation type already exists");
    });
});