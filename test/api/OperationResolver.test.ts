import { OperationType, OperationTypeModel } from "../../src/api/model/OperationType";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { Operation, OperationModel } from "../../src/api/model/Operation";
import { operationTypes, cleaning, distribution} from "../data/OperationTypes";
import { operationsData, cleaningOperation, distributionOperationInput, updateDistributionOperationInput} from "../data/Operations";
import { facilities, booz} from "../data/Facilities";
import { OperationComparator } from "../util/OperationComparator";
import { plainToClass } from "class-transformer";
import { OperationOutput } from "../../src/api/resolver/types/output/OperationOutput";
import { OperationService } from "../../src/api/service/OperationService";

import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";
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

describe("Operation Resolver Tests", () => {
    it("Resolver should return all operations", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let allOperations = gql`
        query {
            allOperations(facilityId: "${booz._id}") {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime}
            }
        }`;
        let { data } = await client.query({ query: allOperations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allOperations).toBeDefined();
        expect(data.allOperations).not.toBeNull();
        expect(data.allOperations).toHaveLength(1);
        let operation: OperationOutput = data.allOperations[0];
        operation.createdAt = new Date(operation.createdAt);
        OperationComparator.compareAllFieldsFromResolver(operation, boozOperation, cleaning);
    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should return all operations with facilities", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let allOperations = gql`
        query {
            allOperations(facilityId: "${booz._id}") {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime}
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: allOperations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allOperations).toBeDefined();
        expect(data.allOperations).not.toBeNull();
        expect(data.allOperations).toHaveLength(1);
        data.allOperations[0].facility!._id = data.allOperations[0].facility!.id;
        let operation: OperationOutput = data.allOperations[0];
        operation.createdAt = new Date(operation.createdAt);
        OperationComparator.compareAllFieldsWithFacilityFromResolver(operation, boozOperation, cleaning, booz);

    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should return operation given type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operation = gql`
        query {
            operation(name: "${cleaning.name}", facilityId: "${booz._id}") {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime}
            }
        }`;
        let { data } = await client.query({ query: operation });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.operation).toBeDefined();
        expect(data.operation).not.toBeNull();
        expect(data.operation).toHaveLength(1);
        let operationOutput: OperationOutput = data.operation[0];
        operationOutput.createdAt = new Date(operationOutput.createdAt);
        OperationComparator.compareAllFieldsFromResolver(operationOutput, boozOperation, cleaning);
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should return operation with facility given type name and facility id", async () => {
        let boozOperation: Operation = plainToClass(Operation, cleaningOperation);
        let operation = gql`
        query {
            operation(name: "${cleaning.name}", facilityId: "${booz._id}") {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime},
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: operation });
        expect(data).toBeDefined();
        expect(data.operation).toBeDefined();
        expect(data.operation).toHaveLength(1);
        let operationOutput: OperationOutput = data.operation[0];
        operationOutput.createdAt = new Date(operationOutput.createdAt);
        OperationComparator.compareAllFieldsWithFacilityFromResolver(operationOutput, boozOperation, cleaning, booz);
    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should save a operation", async () => {
        let boozDistributionOperation: Operation = plainToClass(Operation, distributionOperationInput);
        let saveOperation = gql`
        mutation {
            saveOperation( operation: {
                type: "${distributionOperationInput.type}",
                facility: "${distributionOperationInput.facility}",
                desc: "${distributionOperationInput.desc}",
                poc: "${distributionOperationInput.poc}",
                email: "${distributionOperationInput.email}",
                phone: "${distributionOperationInput.phone}",
                url: "${distributionOperationInput.url}",
                room: "${distributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Monday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime}
            }
        }`;

        let { data } = await client.mutate({ mutation: saveOperation });
        expect(data).toBeDefined();
        expect(data.saveOperation).toBeDefined();
        let operationOutput: OperationOutput = data.saveOperation;
        operationOutput.createdAt = new Date(operationOutput.createdAt);
        OperationComparator.compareAllFieldsFromResolver(operationOutput, boozDistributionOperation, distribution);
    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should update an existing operation", async () => {
        let boozDistributionOperation: Operation = plainToClass(Operation, updateDistributionOperationInput);
        let disOperationFound: Operation[] | null = await service.getOperationWithFacility(distribution.name, booz._id);

        let updateOperation = gql`
        mutation {
            updateOperation(id: "${disOperationFound![0]._id}", operation: {
                type: "${updateDistributionOperationInput.type}",
                facility: "${updateDistributionOperationInput.facility}",
                desc: "${updateDistributionOperationInput.desc}",
                poc: "${updateDistributionOperationInput.poc}",
                email: "${updateDistributionOperationInput.email}",
                phone: "${updateDistributionOperationInput.phone}",
                url: "${updateDistributionOperationInput.url}",
                room: "${updateDistributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Monday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc, email, phone, url, room, poc,
                operationalHours {day, openTime, closeTime}
            }
        }`;
        let { data } = await client.mutate({ mutation: updateOperation });
        expect(data).toBeDefined();
        expect(data.updateOperation).toBeDefined();
        let operationOutput: OperationOutput = data.updateOperation;
        operationOutput.createdAt = new Date(operationOutput.createdAt);
        OperationComparator.compareAllFieldsFromResolver(operationOutput, boozDistributionOperation, distribution);
    });
});



describe("Operation Resolver Tests", () => {
    it("Resolver should delete a operation", async () => {
        let disOperationFound: Operation[] | null = await service.getOperation(distribution.name, booz._id);
       
        let deleteOperation = gql`
        mutation {
             deleteOperation(id: "${disOperationFound![0]._id.toString()}") 
        }`;
        let { data } = await client.mutate({ mutation: deleteOperation });

        expect(data).toBeDefined();
        expect(data.deleteOperation).toBeDefined();
        expect(data.deleteOperation).toEqual(true);
    });
});


//all -ve test cases
describe("Operation Resolver Tests", () => {
    it("Resolver should error to delete a operation, operation should not exist", async () => {
        const deleteOperation = gql`
        mutation {
            deleteOperation(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteOperation
        })).rejects.toThrowError("GraphQL error: Unable to delete operation. Operation not found.");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to update a operation, operation should not exist", async () => {
        const updateOperation = gql`
        mutation {
            updateOperation(id: "5f05d1514b5dcbb405111945", operation: {
                type: "${updateDistributionOperationInput.type}",
                facility: "${updateDistributionOperationInput.facility}",
                desc: "${updateDistributionOperationInput.desc}",
                poc: "${updateDistributionOperationInput.poc}",
                email: "${updateDistributionOperationInput.email}",
                phone: "${updateDistributionOperationInput.phone}",
                url: "${updateDistributionOperationInput.url}",
                room: "${updateDistributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Monday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateOperation
        })).rejects.toThrowError("GraphQL error: Unable to update operation. Operation not found.");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to update a operation, operational hours should be incorrect", async () => {
        let cleanOperationFound: Operation[] | null = await service.getOperationWithFacility(cleaning.name, booz._id);

        let updateOperation = gql`
        mutation {
            updateOperation(id: "${cleanOperationFound![0]._id}", operation: {
                type: "${updateDistributionOperationInput.type}",
                facility: "${updateDistributionOperationInput.facility}",
                desc: "${updateDistributionOperationInput.desc}",
                poc: "${updateDistributionOperationInput.poc}",
                email: "${updateDistributionOperationInput.email}",
                phone: "${updateDistributionOperationInput.phone}",
                url: "${updateDistributionOperationInput.url}",
                room: "${updateDistributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateOperation
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});



describe("Operation Resolver Tests", () => {
    it("Resolver should error to update a operation, operation type should not exist", async () => {
        
        let cleanOperationFound: Operation[] | null = await service.getOperationWithFacility(cleaning.name, booz._id);

        let updateOperation = gql`
        mutation {
            updateOperation(id: "${cleanOperationFound![0]._id}", operation: {
                type: "AAA",
                facility: "${updateDistributionOperationInput.facility}",
                desc: "${updateDistributionOperationInput.desc}",
                poc: "${updateDistributionOperationInput.poc}",
                email: "${updateDistributionOperationInput.email}",
                phone: "${updateDistributionOperationInput.phone}",
                url: "${updateDistributionOperationInput.url}",
                room: "${updateDistributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Monday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateOperation
        })).rejects.toThrowError("GraphQL error: OperationType does not exist");
    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should error to update a operation, facility should not exist", async () => {
        let cleanOperationFound: Operation[] | null = await service.getOperationWithFacility(cleaning.name, booz._id);

        let updateOperation = gql`
        mutation {
            updateOperation(id: "${cleanOperationFound![0]._id}", operation: {
                type: "${updateDistributionOperationInput.type}",
                facility: "AAA",
                desc: "${updateDistributionOperationInput.desc}",
                poc: "${updateDistributionOperationInput.poc}",
                email: "${updateDistributionOperationInput.email}",
                phone: "${updateDistributionOperationInput.phone}",
                url: "${updateDistributionOperationInput.url}",
                room: "${updateDistributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Monday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
            }) {
                id, type, createdAt, updatedAt, desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateOperation
        })).rejects.toThrowError("GraphQL error: Facility AAA does not exist");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to save a operation, facility should not exist", async () => {
        let saveOperation = gql`
        mutation {
            saveOperation( operation: {
                type: "${distributionOperationInput.type}",
                facility: "AAA",
                desc: "${distributionOperationInput.desc}",
                poc: "${distributionOperationInput.poc}",
                email: "${distributionOperationInput.email}",
                phone: "${distributionOperationInput.phone}",
                url: "${distributionOperationInput.url}",
                room: "${distributionOperationInput.room}",
                operationalHours: null
                }) {
                    id, type, createdAt, updatedAt, desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveOperation
        })).rejects.toThrowError("GraphQL error: Facility AAA does not exist");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to save a operation, operation should already exist", async () => {
        let saveOperation = gql`
        mutation {
            saveOperation( operation: {
                type: "CLEANING_SERVICE",
                facility: "${cleaningOperation.facility}",
                desc: "${cleaningOperation.desc}",
                poc: "${cleaningOperation.poc}",
                email: "${cleaningOperation.email}",
                phone: "${cleaningOperation.phone}",
                url: "${cleaningOperation.url}",
                room: "${cleaningOperation.room}",
                operationalHours: null
                }) {
                    id, type, createdAt, updatedAt, desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveOperation
        })).rejects.toThrowError("GraphQL error: Operation already exists for operation type, operation description and facility");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to save a operation, operation type should not exist", async () => {
        let saveOperation = gql`
        mutation {
            saveOperation( operation: {
                type: "AAA",
                facility: "${distributionOperationInput.facility}",
                desc: "${distributionOperationInput.desc}",
                poc: "${distributionOperationInput.poc}",
                email: "${distributionOperationInput.email}",
                phone: "${distributionOperationInput.phone}",
                url: "${distributionOperationInput.url}",
                room: "${distributionOperationInput.room}",
                operationalHours: null
                }) {
                    id, type, createdAt, updatedAt, desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveOperation
        })).rejects.toThrowError("GraphQL error: Operation Type does not exist");
    });
});


describe("Operation Resolver Tests", () => {
    it("Resolver should error to save a operation, operational hours should be incorrect", async () => {
        let saveOperation = gql`
        mutation {
            saveOperation( operation: {
                type: "${distributionOperationInput.type}",
                facility: "${distributionOperationInput.facility}",
                desc: "${distributionOperationInput.desc}",
                poc: "${distributionOperationInput.poc}",
                email: "${distributionOperationInput.email}",
                phone: "${distributionOperationInput.phone}",
                url: "${distributionOperationInput.url}",
                room: "${distributionOperationInput.room}",
                operationalHours: [
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Sunday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Tuesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Wednesday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Thursday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Friday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    },
                    {
                        day: Saturday,
                        openTime: "6:00 AM",
                        closeTime: "10:00 PM"
                    }
                ]
                }) {
                    id, type, createdAt, updatedAt, desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveOperation
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should error to delete a operation, operation should not exist", async () => {
        let deleteOperation = gql`
        mutation {
            deleteOperation(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteOperation
        })).rejects.toThrowError("GraphQL error: Unable to delete operation. Operation not found.");
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should not find operations, operations should not exist", async () => {
        let allOperations = gql`
        query {
            allOperations(facilityId: "ZZZZ") {
                id, type
            }
        }`;
        const { data } = await client.query({ query: allOperations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allOperations).toBeDefined();
        expect(data.allOperations).not.toBeNull();
        expect(data.allOperations).toHaveLength(0);
    });
});

describe("Operation Resolver Tests", () => {
    it("Resolver should not find operations, operations should not exist", async () => {
        let operation = gql`
        query {
            operation(name: "AAA", facilityId: "ZZZ") {
                id, type, createdAt, updatedAt, desc
            }
        }`;
        const { data } = await client.query({ query: operation });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.operation).toBeDefined();
        expect(data.operation).not.toBeNull();
        expect(data.operation).toHaveLength(0);
    });
});
