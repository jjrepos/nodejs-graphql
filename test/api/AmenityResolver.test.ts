import { gql } from "apollo-boost";
import { plainToClass } from "class-transformer";
import { connection } from "mongoose";
import { Facility, FacilityModel } from "../../src/api/model/Facility";
import { Amenity, AmenityModel } from "../../src/api/model/Amenity";
import { AmenityOutput } from "../../src/api/resolver/types/output/AmenityOutput";
import { AmenityType, AmenityTypeModel } from "../../src/api/model/AmenityType";
import { facilities, hamilton } from "../data/Facilities";
import { amenitiesData, bikeRackAmenityData, toUpdateFaxMachineAmenityData, faxMachineAmenityData } from "../data/Amenities";
import { amenityTypes, faxMachine, bikeRack } from "../data/AmenityTypes";
import { client } from "../util/GraphQLClient";
import { AmenityComparator } from "../util/AmenityComparator";




beforeAll(async () => {
    await connection.db.dropDatabase();
    await AmenityTypeModel.create(amenityTypes);
    await AmenityTypeModel.create(faxMachine);
    await FacilityModel.create(facilities);

    let bikeRack: AmenityType | null = await AmenityTypeModel.findOne({ name: "BIKE_RACK" }).exec();
    let printing: AmenityType | null = await AmenityTypeModel.findOne({ name: "PRINTING" }).exec();
    let hamilton: Facility | null = await FacilityModel.findById("HMLT").exec();

    let amenities: Amenity[] = plainToClass(Amenity, amenitiesData);
    amenities[0].facility = hamilton!._id;
    amenities[0].type = bikeRack!;
    amenities[0].address = hamilton!.address;
    amenities[1].facility = hamilton!._id;
    amenities[1].type = printing!;
    amenities[1].address = hamilton!.address;
    await AmenityModel.create(amenities);
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should return all amenities", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);

        const allAmenities = gql`
        query {
            allAmenities(facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite
            }
        }`;
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allAmenities).toBeDefined();
        expect(data.allAmenities).not.toBeNull();
        expect(data.allAmenities).toHaveLength(2);
        let amenity: AmenityOutput = data.allAmenities[0];
        amenity.createdAt = new Date(amenity.createdAt);
        AmenityComparator.compareAllFieldsFromResolver(amenity, hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should return all amenities with facilities", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);

        const allAmenities = gql`
        query {
            allAmenities(facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
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
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allAmenities).toBeDefined();
        expect(data.allAmenities).not.toBeNull();
        expect(data.allAmenities).toHaveLength(2);
        data.allAmenities[0].facility!._id = data.allAmenities[0].facility!.id;
        let amenity: AmenityOutput = data.allAmenities[0];
        amenity.createdAt = new Date(amenity.createdAt);
        AmenityComparator.compareAllFieldsWithFacilityFromResolver(amenity, hamiltonAmenity, hamilton, bikeRack);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should return all amenities given type name", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);

        const allAmenities = gql`
        query {
            amenity(name: "${bikeRack.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite
            }
        }`;
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.amenity).toBeDefined();
        expect(data.amenity).not.toBeNull();
        expect(data.amenity).toHaveLength(1);
        let amenity: AmenityOutput = data.amenity[0];
        amenity.createdAt = new Date(amenity.createdAt);
        AmenityComparator.compareAllFieldsFromResolver(amenity, hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should return all amenities with facilities given type name", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, bikeRackAmenityData);

        const allAmenities = gql`
        query {
            amenity(name: "${bikeRack.name}", facilityId: "${hamilton._id}") {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite,
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
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.amenity).toBeDefined();
        expect(data.amenity).not.toBeNull();
        expect(data.amenity).toHaveLength(1);
        let amenity: AmenityOutput = data.amenity[0];
        amenity.createdAt = new Date(amenity.createdAt);
        AmenityComparator.compareAllFieldsFromResolver(amenity, hamiltonAmenity, bikeRack);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should save a amenity", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, faxMachineAmenityData);

        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
                desc: "Located in the Hamilton Lower Level. Showers available. To use the Center, staff must sign a release form, available from Access Control Office, Booz 1009. Hours of Operation: 24 hours with badge",
                email: null,
                phone: null,
                url: null,
                onsite: true
            }) {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite
            }
        }`;
        const { data } = await client.mutate({ mutation: saveAmenity });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveAmenity).toBeDefined();
        expect(data.saveAmenity).not.toBeNull();
        let amenity: AmenityOutput = data.saveAmenity;
        amenity.createdAt = new Date(amenity.createdAt);
        AmenityComparator.compareAllFieldsFromResolver(amenity, hamiltonAmenity, faxMachine);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should update an existing amenity", async () => {
        let hamiltonAmenity: Amenity = plainToClass(Amenity, toUpdateFaxMachineAmenityData);

        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "${amenityId}", amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
                desc: "Located in the Hamilton Lower Level. Showers available. To use the Center, staff must sign a release form, available from Access Control Office, Booz 1009. Hours of Operation: 24 hours with badge",
                email: "updated_fax@bah.com",
                phone: null,
                url: "boozfax.bah.com",
                onsite: true
            }) {
                id,
                type,
                createdAt,
                updatedAt,
                desc,
                email,
                phone,
                url,
                onsite
            }
        }`;
        const { data } = await client.mutate({ mutation: updateAmenity });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateAmenity).toBeDefined();
        expect(data.updateAmenity).not.toBeNull();
        let updated: AmenityOutput = data.updateAmenity;
        updated.createdAt = new Date(updated.createdAt);
        AmenityComparator.compareAllFieldsFromResolver(updated, hamiltonAmenity, faxMachine);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should delete a amenity", async () => {
        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const deleteAmenity = gql`
        mutation {
            deleteAmenity(id: "${amenityId}")
        }`;
        const { data } = await client.mutate({ mutation: deleteAmenity });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.deleteAmenity).toBeDefined();
        expect(data.deleteAmenity).not.toBeNull();
        expect(data.deleteAmenity).toBe(true);

        const postDeleteAmenityByTypeName = gql`
        query {
            transportation(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let postDeleteAmenityData = await client.query({ query: postDeleteAmenityByTypeName });
        expect(postDeleteAmenityData.data).toBeDefined();
        expect(postDeleteAmenityData.data).not.toBeNull();
        expect(postDeleteAmenityData.data.transportation).toBeDefined();
        expect(postDeleteAmenityData.data.transportation).not.toBeNull();
        expect(postDeleteAmenityData.data.transportation).toHaveLength(0);
    });
});

//all -ve test cases
describe("Amenity Resolver Tests", () => {
    it("Resolver should error to delete a amenity, amenity should not exist", async () => {
        const deleteAmenity = gql`
        mutation {
            deleteAmenity(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteAmenity
        })).rejects.toThrowError("GraphQL error: Unable to delete amenity 5f05d1514b5dcbb405111945. Amenity not found.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to update a amenity, amenity should not exist", async () => {
        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "5f05d1514b5dcbb405111945", amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: true
            }) {
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateAmenity
        })).rejects.toThrowError("GraphQL error: Unable to update amenity 5f05d1514b5dcbb405111945. Amenity not found.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to update a amenity, operational hours should be incorrect", async () => {
        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "${amenityId}", amenity: {
                type:"${faxMachine.name}",
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
            mutation: updateAmenity
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to update a amenity, amenity type should not exist", async () => {
        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "${amenityId}", amenity: {
                type:"CHILD_CARE_CENTER",
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
            mutation: updateAmenity
        })).rejects.toThrowError("GraphQL error: AmenityType does not exist");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to update a amenity, amenity type should not exist", async () => {
        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "${amenityId}", amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
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
            mutation: updateAmenity
        })).rejects.toThrowError("GraphQL error: Amenity address is missing.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to update a amenity, facility should not exist", async () => {
        const amenityByTypeName = gql`
        query {
            amenity(name: "${faxMachine.name}", facilityId: "${hamilton._id}") {
                id
            }
        }`;
        let amenityData = await client.query({ query: amenityByTypeName });
        expect(amenityData.data).toBeDefined();
        expect(amenityData.data).not.toBeNull();
        expect(amenityData.data.amenity).toBeDefined();
        expect(amenityData.data.amenity).not.toBeNull();
        expect(amenityData.data.amenity).toHaveLength(1);
        let amenityId = amenityData.data.amenity[0].id;
        expect(amenityId).not.toBeNull();

        const updateAmenity = gql`
        mutation {
            updateAmenity(id: "${amenityId}", amenity: {
                type:"${faxMachine.name}",
                facility:"ZZZZ",
                desc: "Located in the front of the building updated",
                email: "facilities_updated@bah.com",
                phone: "571-390-9999",
                url: null,
                onsite: true
            }) {
                id,
                type,
                createdAt,
                updatedAt,
                desc
            }
        }`;
        await expect(client.mutate({
            mutation: updateAmenity
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to save an amenity, facility should not exist", async () => {
        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"${bikeRack.name}",
                facility:"ZZZZ",
                desc: "Located in the Booz garage, P2 level, and the Allen garage, L1 level",
                email: null,
                phone: null,
                url: null,
                onsite: true
                }) {
                    id,
                    type,
                    createdAt,
                    updatedAt,
                    desc
                }
            }`;
        await expect(client.mutate({
            mutation: saveAmenity
        })).rejects.toThrowError("GraphQL error: Facility does not exist.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to save a amenity, amenity type should not exist", async () => {
        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"CHILD_CARE_CENTER",
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
            mutation: saveAmenity
        })).rejects.toThrowError("GraphQL error: AmenityType does not exist");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to save a amenity, operational hours should be incorrect", async () => {
        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"${faxMachine.name}",
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
            mutation: saveAmenity
        })).rejects.toThrowError("GraphQL error: Duplicate days found.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to save a amenity, address should be missing", async () => {
        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
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
            mutation: saveAmenity
        })).rejects.toThrowError("GraphQL error: Amenity address is missing.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should error to save a amenity, variables should not contain blank spaces only", async () => {
        const saveAmenity = gql`
        mutation {
            saveAmenity(amenity: {
                type:"${faxMachine.name}",
                facility:"HMLT",
                desc: "   ",
                email: "   ",
                phone: "   ",
                url: "   ",
                onsite: false,
                address: {
                    street1: "   ",
                    city: "   ",
                    zipCode: "   ",
                    stateCode: "   ",
                    countryCode: "   "
                },
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
            mutation: saveAmenity
        })).rejects.toThrowError("GraphQL error: desc, email, phone, url, street1, city, zipCode, stateCode, countryCode should not contain blank spaces only.");
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should not find amenities, amenities should not exist", async () => {

        const allAmenities = gql`
        query {
            allAmenities(facilityId: "ZZZZ") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allAmenities).toBeDefined();
        expect(data.allAmenities).not.toBeNull();
        expect(data.allAmenities).toHaveLength(0);
    });
});

describe("Amenity Resolver Tests", () => {
    it("Resolver should not find amenities, amenities should not exist", async () => {
        const allAmenities = gql`
        query {
            amenity(name: "CHILD_CARE_CENTER", facilityId: "${hamilton._id}") {
                id,
                type
            }
        }`;
        const { data } = await client.query({ query: allAmenities });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.amenity).toBeDefined();
        expect(data.amenity).not.toBeNull();
        expect(data.amenity).toHaveLength(0);
    });
});