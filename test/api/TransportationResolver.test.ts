import { gql } from "apollo-boost";
import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Transportation, TransportationModel } from "../../src/api/model/Transportation";
import { TransportationType, TransportationTypeModel } from "../../src/api/model/TransportationType";
import { facilities, hamilton } from "../data/Facilities"; //booz
import { hamiltonMetroTransportationData, hamiltonParkingTransportationData, toUpdatehamiltonMetroTransportationData, transportationsData } from "../data/Transportations";
import { metro, parking, transportationTypes } from "../data/TransportationTypes";
import { client } from "../util/GraphQLClient";
import { TransportationComparator } from "../util/TransportationComparator";
import { TransportationOutput } from "../../src/api/resolver/types/output/TransportationOutput";




beforeAll(async () => {
    await connection.db.dropDatabase();
    await TransportationTypeModel.create(transportationTypes);
    await TransportationTypeModel.create(metro);
    await FacilityModel.create(facilities);
    let parking: TransportationType | null = await TransportationTypeModel.findOne({ name: "PARKING" }).exec();
    let visitor: TransportationType | null = await TransportationTypeModel.findOne({ name: "VISITOR_PARKING" }).exec();
    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let transportations: Transportation[] = plainToClass(Transportation, transportationsData);
    transportations[0].facility = hamilton!;
    transportations[0].type = parking!;
    transportations[0].address = hamilton!.address;
    transportations[1].facility = hamilton!;
    transportations[1].type = visitor!;
    transportations[1].address = hamilton!.address;
    transportations[2].facility = booz!;
    transportations[2].type = parking!;
    transportations[2].address = booz!.address;
    await TransportationModel.create(transportations);
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should return all transportations", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);

        const allTransportations = gql`
        query {
            allTransportations(facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                }
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allTransportations).toBeDefined();
        expect(data.allTransportations).not.toBeNull();
        expect(data.allTransportations).toHaveLength(2);
        let transportation: TransportationOutput = data.allTransportations[0];
        transportation.createdAt = new Date(transportation.createdAt);
        TransportationComparator.compareAllFieldsFromResolver(transportation, hamiltonTransportation, parking);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should return all transportations with facilities", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);

        const allTransportations = gql`
        query {
            allTransportations(facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                },
                facility {
                    id,
                    name,
                    campusCode,
                    address {
                        street1,
                        city,
                        stateCode,
                        zipCode
                    },
                    location {
                        type,
                        coordinates
                    }
                }
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allTransportations).toBeDefined();
        expect(data.allTransportations).not.toBeNull();
        expect(data.allTransportations).toHaveLength(2);
        data.allTransportations[0].facility!._id = data.allTransportations[0].facility!.id;
        let transportation: TransportationOutput = data.allTransportations[0];
        transportation.createdAt = new Date(transportation.createdAt);
        TransportationComparator.compareAllFieldsWithFacilityFromResolver(transportation, hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should return all transportations given type name", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);

        const allTransportations = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                }
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.transportation).toBeDefined();
        expect(data.transportation).not.toBeNull();
        expect(data.transportation).toHaveLength(1);
        let transportation: TransportationOutput = data.transportation[0];
        transportation.createdAt = new Date(transportation.createdAt);
        TransportationComparator.compareAllFieldsFromResolver(transportation, hamiltonTransportation, parking);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should return all transportations with facilities given type name", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonParkingTransportationData);

        const allTransportations = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                },
                facility {
                    id,
                    name,
                    campusCode,
                    address {
                        street1,
                        city,
                        stateCode,
                        zipCode
                    },
                    location {
                        type,
                        coordinates
                    }
                }
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.transportation).toBeDefined();
        expect(data.transportation).not.toBeNull();
        expect(data.transportation).toHaveLength(1);
        data.transportation[0].facility!._id = data.transportation[0].facility!.id;
        let transportation: TransportationOutput = data.transportation[0];
        transportation.createdAt = new Date(transportation.createdAt);
        TransportationComparator.compareAllFieldsWithFacilityFromResolver(transportation, hamiltonTransportation, hamilton, parking);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should save a transportation", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, hamiltonMetroTransportationData);

        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"${metro.name}",
                facility:"HMLT",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building",
                email: "facilities@bah.com",
                phone: "571-390-0808",
                url: null,
                onsite: true,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                }
            }
        }`;
        const { data } = await client.mutate({ mutation: saveTransportation });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveTransportation).toBeDefined();
        expect(data.saveTransportation).not.toBeNull();
        let transportation: TransportationOutput = data.saveTransportation;
        transportation.createdAt = new Date(transportation.createdAt);
        TransportationComparator.compareAllFieldsFromResolver(transportation, hamiltonTransportation, metro);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should update an existing transportation", async () => {
        let hamiltonTransportation: Transportation = plainToClass(Transportation, toUpdatehamiltonMetroTransportationData);

        const transportationTypeByName = gql`
        query {
            transportation(name: "${metro.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "${transportationId}", transportation: {
                type:"${metro.name}",
                facility:"HMLT",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: true,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                }
            }
        }`;
        const { data } = await client.mutate({ mutation: updateTransportation });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateTransportation).toBeDefined();
        expect(data.updateTransportation).not.toBeNull();
        let updated: TransportationOutput = data.updateTransportation;
        updated.createdAt = new Date(updated.createdAt);
        TransportationComparator.compareAllFieldsFromResolver(updated, hamiltonTransportation, metro);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should delete a transportation", async () => {
        const transportationTypeByName = gql`
        query {
            transportation(name: "${metro.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        client.cache.reset();

        const deleteTransportation = gql`
        mutation {
            deleteTransportation(id: "${transportationId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteTransportation });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteTransportation).toBeDefined();
        expect(data.deleteTransportation).not.toBeNull();
        expect(data.deleteTransportation).toBe(true);

        const postDeleteTransportationTypeByName = gql`
        query {
            transportation(name: "${metro.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let postDeleteTransportationData = await client.query({ query: postDeleteTransportationTypeByName });
        expect(postDeleteTransportationData.data).toBeDefined();
        expect(postDeleteTransportationData.data).not.toBeNull();
        expect(postDeleteTransportationData.data.transportation).toBeDefined();
        expect(postDeleteTransportationData.data.transportation).not.toBeNull();
        expect(postDeleteTransportationData.data.transportation).toHaveLength(0);
    });
});

//all -ve test cases
describe("Transportation Resolver Tests", () => {
    it("Resolver should error to delete a transportation, transportation should not exist", async () => {
        const deleteTransportation = gql`
        mutation {
            deleteTransportation(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteTransportation
        })).rejects.toThrowError("GraphQL error: Unable to delete transportation 5f05d1514b5dcbb405111945. Transportation not found.");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to update a transportation, transportation should not exist", async () => {
        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "5f05d1514b5dcbb405111945", transportation: {
                type:"${metro.name}",
                facility:"HMLT",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: true,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportation
        })).rejects.toThrowError("GraphQL error: Unable to update transportation 5f05d1514b5dcbb405111945. Transportation not found.");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to update a transportation, operational hours should be incorrect", async () => {
        const transportationTypeByName = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "${transportationId}", transportation: {
                type:"${parking.name}",
                facility:"HMLT",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: false,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportation
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to update a transportation, transportation type should not exist", async () => {
        const transportationTypeByName = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "${transportationId}", transportation: {
                type:"WALKING",
                facility:"HMLT",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: false,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportation
        })).rejects.toThrowError("GraphQL error: TransportationType does not exist");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to update a transportation, facility should not exist", async () => {
        const transportationTypeByName = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "${transportationId}", transportation: {
                type:"WALKING",
                facility:"ZZZZ",
                address: {
                    street1: "4567 bah way",
                    city: "McLean",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: false,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportation
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

/*
describe("Transportation Resolver Tests", () => {
    it("Resolver should error to update a transportation, tranportation already exists", async () => {
        const transportationTypeByName = gql`
        query {
            transportation(name: "${parking.name}", facilityId: "${booz._id}") {
                id
            }
        }`;
        let transportationData = await client.query({ query: transportationTypeByName });
        expect(transportationData.data).toBeDefined();
        expect(transportationData.data).not.toBeNull();
        expect(transportationData.data.transportation).toBeDefined();
        expect(transportationData.data.transportation).not.toBeNull();
        expect(transportationData.data.transportation).toHaveLength(1);
        let transportationId = transportationData.data.transportation[0].id;
        expect(transportationId).not.toBeNull();

        const updateTransportation = gql`
        mutation {
            updateTransportation(id: "${transportationId}", transportation: {
                type:"${parking.name}",
                facility:"HMLT",
                address: {
                    street1: "8283 Greensboro Dr",
                    city: "McLean",
                    zipCode: "22102",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: true,
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
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
                address {
                    street1,
                    city,
                    stateCode,
                    countryCode
                },
                operationalHours {
                    day,
                    openTime,
                    closeTime
                }
            }
        }`;
        await expect(client.mutate({
            mutation: updateTransportation
        })).rejects.toThrowError("GraphQL error: Transportation already exists");
    });
});
*/

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to save a transportation, facility should not exist", async () => {
        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"${parking.name}",
                facility:"ZZZZ",
                address: {
                    street1: "8283 Greensboro Dr",
                    city: "McLean",
                    zipCode: "22102",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building",
                email: "facilities@bah.com",
                phone: "571-390-0808",
                url: null,
                onsite: true,
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
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveTransportation
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

/*
describe("Transportation Resolver Tests", () => {
    it("Resolver should error to save a transportation, transportation should already exist", async () => {
        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"${parking.name}",
                facility:"HMLT",
                address: {
                    street1: "8283 Greensboro Dr",
                    city: "McLean",
                    zipCode: "22102",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building",
                email: "facilities@bah.com",
                phone: "571-390-0808",
                url: null,
                onsite: true,
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
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveTransportation
        })).rejects.toThrowError("GraphQL error: Transportation already exists");
    });
});
*/

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to save a transportation, transportation type should not exist", async () => {
        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"WALKING",
                facility:"HMLT",
                address: {
                    street1: "8283 Greensboro Dr",
                    city: "McLean",
                    zipCode: "22102",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building",
                email: "facilities@bah.com",
                phone: "571-390-0808",
                url: null,
                onsite: true,
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
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveTransportation
        })).rejects.toThrowError("GraphQL error: TransportationType does not exist");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to save a transportation, operational hours should be incorrect", async () => {
        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"${metro.name}",
                facility:"HMLT",
                address: {
                    street1: "8283 Greensboro Dr",
                    city: "McLean",
                    zipCode: "22102",
                    stateCode: "VA",
                    countryCode: "USA"
                },
                desc: "Located in the front of the building",
                email: "facilities@bah.com",
                phone: "571-390-0808",
                url: null,
                onsite: false,
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
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveTransportation
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should error to save a transportation, variables should not contain blank spaces only", async () => {
        const saveTransportation = gql`
        mutation {
            saveTransportation(transportation: {
                type:"${metro.name}",
                facility:"HMLT",
                address: {
                    street1: "   ",
                    city: "   ",
                    zipCode: "   ",
                    stateCode: "   ",
                    countryCode: "   "
                },
                desc: "   ",
                email: "   ",
                phone: "   ",
                url: "   ",
                onsite: false,
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
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveTransportation
        })).rejects.toThrowError("GraphQL error: desc, email, phone, url, street1, city, zipCode, stateCode, countryCode should not contain blank spaces only.");
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should not find transportations, transportations should not exist", async () => {

        const allTransportations = gql`
        query {
            allTransportations(facilityId: "ZZZZ") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allTransportations).toBeDefined();
        expect(data.allTransportations).not.toBeNull();
        expect(data.allTransportations).toHaveLength(0);
    });
});

describe("Transportation Resolver Tests", () => {
    it("Resolver should not find transportations, transportations should not exist", async () => {
        const allTransportations = gql`
        query {
            transportation(name: "WALKING", facilityId: "${hamilton._id}") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allTransportations });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.transportation).toBeDefined();
        expect(data.transportation).not.toBeNull();
        expect(data.transportation).toHaveLength(0);
    });
});