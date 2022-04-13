import { gql } from "apollo-boost";
import { Facility, FacilityModel, FacilityType, OperationalStatus } from "../../src/api/model/Facility";
import { StateCodeModel} from "../../src/api/model/StateCode";
import { CountryCodeModel} from "../../src/api/model/CountryCode";
import { allen, allenInput, booz, facilities, upgradeBooz } from "../data/Facilities";
import { stateCodes} from "../data/StateCodes";
import { countryCodes } from "../data/CountryCodes";
import { FacilityComparator } from "../util/FacilityComparator";
import { client } from "../util/GraphQLClient";
import { connection } from "mongoose";

beforeAll(async () => {
    console.log(`Api url : ${process.env.API_URL}`);
    await connection.db.dropDatabase();
    
    await StateCodeModel.create(stateCodes);
    await CountryCodeModel.create(countryCodes);
    await FacilityModel.create(facilities);
});

describe("Facility Resolver Tests", () => {
    it("Resolver should return facility given facility id", async () => {
        const facilityById = gql`
        query {
            facility(id: "${booz._id}") {
                id,
                name,
                campusCode,
                address {street1, city, zipCode, stateCode, countryCode, state, country},
                timeZone,
                location {type, coordinates},
                hotelingSite, facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                operationalStatus,
                classificationType,
                createdAt
            }
        }`;
        const { data } = await client.query({ query: facilityById });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.facility).toBeDefined();
        expect(data.facility).not.toBeNull();
        FacilityComparator.compareIds(data.facility, booz);
        let facility: Facility = data.facility;
        FacilityComparator.compareAllFields(facility, booz);
    });
});





describe("Facility Resolver Tests", () => {
    it("Resolver should return paged facilities given skip, take, facility type and hoteling site", async () => {
        const pagedFacilitiesInCampus = gql`
        query {
            FacilityPages(skip: 0, take: 5, facilityFilter: {facilityType: ${FacilityType.OFFICE}, hotelingSite: true}){
                items {
                    id,
                    name,
                    campusCode,
                    address {street1, city, zipCode, stateCode, countryCode, state, country},
                    timeZone,
                    location {type, coordinates},
                    hotelingSite, facilityType,
                    officeHours {day, openTime, closeTime},
                    otherDetail,
                    operationalStatus,
                    classificationType,
                    createdAt
                },
                total,
                hasMore
            }
        }`;
        const { data } = await client.query({ query: pagedFacilitiesInCampus });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.FacilityPages).toBeDefined();
        expect(data.FacilityPages).not.toBeNull();
        expect(data.FacilityPages.items).toHaveLength(2);
        expect(data.FacilityPages.hasMore).toBe(false);
        expect(data.FacilityPages.total).toBe(2);
        FacilityComparator.compareIds(data.FacilityPages.items[0], booz);
        FacilityComparator.compareAllFields(data.FacilityPages.items[0], booz);
    });
});

 //classificationType: ${ClassificationType.Cleared},
describe("Facility Resolver Tests", () => {
    it("Resolver should save a facility", async () => {
        const saveFacility = gql`
        mutation someMutation {
            saveFacility (input:
            {id:"${allenInput.id}" , name:"${allenInput.name}", campusCode:"${allenInput.campusCode}", 
            timeZone: "${allenInput.timeZone}",
            address: {street1: "${allenInput.address.street1}",street2:"${allenInput.address.street2}",city: "${allenInput.address.city}", 
                zipCode: "${allenInput.address.zipCode}", stateCode: "${allenInput.address.stateCode}",countryCode: "${allenInput.address.countryCode}"},
            location: {
                coordinates: {longitude:${allenInput.location!.coordinates[0].longitude}, latitude:${allenInput.location!.coordinates[0].latitude} },
                type: ${allenInput.location!.type} },
            hotelingSite: ${allenInput.hotelingSite}, facilityType: ${allenInput.facilityType},
            otherDetail: "${allenInput.otherDetail!}",
            operationalStatus: ${OperationalStatus.OPEN},
            classificationType: CLEARED,
           
            officeHours: [
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
            })
            {
                id,
                name,
                campusCode,
                address {street1, city, zipCode, stateCode, countryCode, state, country},
                timeZone,
                location {type, coordinates},
                hotelingSite, facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                operationalStatus,
                classificationType,
                createdAt
            }
        }`;
        const { data } = await client.mutate({ mutation: saveFacility });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveFacility).toBeDefined();
        expect(data.saveFacility).not.toBeNull();
        FacilityComparator.compareIds(data.saveFacility, allen);

        let facility: Facility = data.saveFacility;
        FacilityComparator.compareAllFields(facility, allen);

    });
});


describe("Facility Resolver Tests", () => {
    it("Resolver should save (upsert) an existing facility", async () => {
        const saveFacility = gql`
        mutation someMutation {
            saveFacility (input:
            {id:"${upgradeBooz._id}" , name:"${upgradeBooz.name}", campusCode:"${upgradeBooz.campusCode}", 
            timeZone: "${upgradeBooz.timeZone}",
            address: {street1: "${upgradeBooz.address.street1}",street2:"${upgradeBooz.address.street2}",city: "${upgradeBooz.address.city}", 
                zipCode: "${upgradeBooz.address.zipCode}", stateCode: "${upgradeBooz.address.stateCode}",countryCode: "${upgradeBooz.address.countryCode}"},
            location: {
                    coordinates: {longitude:${upgradeBooz.location!.coordinates[0]}, latitude:${upgradeBooz.location!.coordinates[1]} },
                    type: ${upgradeBooz.location!.type} },
            hotelingSite: ${upgradeBooz.hotelingSite}, facilityType: ${upgradeBooz.facilityType},
            otherDetail: "${upgradeBooz.otherDetail!}",
            operationalStatus: ${allenInput.operationalStatus},
            classificationType: CLEARED,
            officeHours: [
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
            })
            {
                id,
                name,
                campusCode,
                address {street1, city, zipCode, stateCode, countryCode, state, country},
                timeZone,
                location {type, coordinates},
                hotelingSite,  facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                operationalStatus,
                classificationType,
                createdAt
            }
        }`;

        console.log("Upsert qeery=" + saveFacility);
        const { data } = await client.mutate({ mutation: saveFacility });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveFacility).toBeDefined();
        expect(data.saveFacility).not.toBeNull();
        FacilityComparator.compareIds(data.saveFacility, upgradeBooz);

        let facility: Facility = data.saveFacility;
        FacilityComparator.compareAllFields(facility, upgradeBooz);
    });
});

describe("Facility Resolver Tests", () => {
    it("Resolver should update a facility", async () => {
        const updateFacility = gql`
        mutation someMutation {
            updateFacility (input:
            {id:"${upgradeBooz._id}" , name:"${upgradeBooz.name}", campusCode:"${upgradeBooz.campusCode}", 
            timeZone: "${upgradeBooz.timeZone}",
            address: {street1: "${upgradeBooz.address.street1}",street2:"${upgradeBooz.address.street2}",city: "${upgradeBooz.address.city}", 
                zipCode: "${upgradeBooz.address.zipCode}", stateCode: "${upgradeBooz.address.stateCode}",countryCode: "${upgradeBooz.address.countryCode}"},
            location: {
                coordinates: {longitude:${upgradeBooz.location!.coordinates[0]}, latitude:${upgradeBooz.location!.coordinates[1]} },
                type: ${upgradeBooz.location!.type} },
                hotelingSite: ${upgradeBooz.hotelingSite}, facilityType: ${upgradeBooz.facilityType},
                otherDetail: "${upgradeBooz.otherDetail!}",
                operationalStatus: ${allenInput.operationalStatus},
                classificationType: CLEARED,
                officeHours: [
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
            })
            {
                id,
                name,
                campusCode,
                address {street1, city, zipCode, stateCode, countryCode, state, country},
                timeZone,
                location {type, coordinates},
                hotelingSite,  facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                operationalStatus,
                classificationType,
                createdAt
            }
        }`;

        const { data } = await client.mutate({ mutation: updateFacility });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.updateFacility).toBeDefined();
        expect(data.updateFacility).not.toBeNull();
        FacilityComparator.compareIds(data.updateFacility, upgradeBooz);

        let facility: Facility = data.updateFacility;
        FacilityComparator.compareAllFields(facility, upgradeBooz);
    });
});


describe("Facility Resolver Tests", () => {
    it("Resolver should delete a facility", async () => {
        const deleteFacility = gql`
        mutation someMutation {
            deleteFacility (id:"${allenInput.id}")
                
        }`;
        const { data } = await client.mutate({ mutation: deleteFacility });
        expect(data).toBeDefined();
        expect(data.deleteFacility).toEqual(true);

    });
});

describe("Facility Resolver Tests", () => {
    it("Resolver should save facility, if non-required field is missing", async () => {
        const saveFacility = gql`
        mutation someMutation {
            saveFacility (input:
                {id:"${allenInput.id}" , name:"${allenInput.name}", campusCode:"${allenInput.campusCode}", 
                timeZone: "${allenInput.timeZone}",
                address: {street1: "${allenInput.address.street1}",street2:"${allenInput.address.street2}",city: "${allenInput.address.city}", 
                    zipCode: "${allenInput.address.zipCode}", stateCode: "${allenInput.address.stateCode}",countryCode: "${allenInput.address.countryCode}"},
                location: {
                    coordinates: {longitude:${allenInput.location!.coordinates[0].longitude}, latitude:${allenInput.location!.coordinates[0].latitude} },
                    type: ${allenInput.location!.type} },
                hotelingSite: ${allenInput.hotelingSite}, facilityType: ${allenInput.facilityType},
                otherDetail: "${allenInput.otherDetail!}",
                operationalStatus: ${allenInput.operationalStatus},
                classificationType: CLEARED,
                officeHours: [
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
            ]})
            {
                id,
                name,
                campusCode,
                timeZone,
                address {street1, city, zipCode, stateCode, countryCode, state, country},
                location {type, coordinates},
                hotelingSite,  facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                operationalStatus,
                classificationType,
                createdAt
            }
        }`;

        const { data } = await client.mutate({ mutation: saveFacility });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.saveFacility).toBeDefined();
        expect(data.saveFacility).not.toBeNull();
        
        FacilityComparator.compareIds(data.saveFacility, allen);
        let facility: Facility = data.saveFacility;
        FacilityComparator.compareAllFields(facility, allen);

    });
});


//all -ve test cases
describe("Facility Resolver Tests", () => {
    it("Resolver should error to delete a facility, if facility does not exist", async () => {
        const deleteFacility = gql`
        mutation someMutation {
            deleteFacility (id:"AAAA")
        }`;

        await expect(client.mutate({
            mutation: deleteFacility
        })).rejects.toThrowError("GraphQL error: Unable to delete facility AAAA. Facility not found");

    });
});


describe("Facility Resolver Tests", () => {
    it("Resolver should error updating a facility, which does not exist", async () => {
        const updateFacility = gql`
        mutation someMutation {
            updateFacility (input:
            {id:"BBBB" , name:"${allen.name}", campusCode:"${allen.campusCode}", 
            timeZone: "${upgradeBooz.timeZone}",
            address: {street1: "${allen.address.street1}",street2:"${allen.address.street2}",city: "${allen.address.city}", 
                zipCode: "${allen.address.zipCode}", stateCode: "${allen.address.stateCode}",countryCode: "${allen.address.countryCode}"},
            
            hotelingSite: ${allen.hotelingSite}, facilityType: ${allen.facilityType},
            otherDetail: "${allen.otherDetail!}",
            operationalStatus: ${allenInput.operationalStatus},
            classificationType: CLEARED,
            location: {
                coordinates: {longitude:${allen.location!.coordinates[0]}, latitude:${allen.location!.coordinates[1]} },
                type: ${allen.location!.type} },
            officeHours: [
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
           
            })
            {
                id,
                name,
                campusCode
            }
        }`;
        await expect(client.mutate({
            mutation: updateFacility
        })).rejects.toThrowError("Unable to update facility BBBB. Facility not found.");
    });
});


describe("Facility Resolver Tests", () => {
    it("Resolver should not save facility, if required fields are missing", async () => {
        const saveFacility = gql`
        mutation someMutation {
            saveFacility (input:
            {id: "ZZZZ" , name: null, campusCode: null, 
            timeZone: "${allen.timeZone}",
            address: {street1: null, street2:"${allen.address.street2}",city: null, 
                zipCode: "${allen.address.zipCode}", stateCode: "${allen.address.stateCode}",countryCode: "${allen.address.countryCode}"},
            location: {
                coordinates: {longitude:${allen.location!.coordinates[0]}, latitude:${allen.location!.coordinates[1]} },
                type: ${allen.location!.type} },
            hotelingSite: ${allen.hotelingSite}, facilityType: ${allen.facilityType},
            otherDetail: "${allen.otherDetail!}",
            operationalStatus: ${allenInput.operationalStatus},
            classificationType: CLEARED,
            officeHours: [
                {
                    day: Sunday,
                    openTime: "6:00 AM",
                    closeTime: "10:00 PM"
                }
            ]
            })
            {
                id,
                name,
                campusCode
            }
        }`;

        await expect(client.mutate({
            mutation: saveFacility
        })).rejects.toThrowError("GraphQL error: Argument Validation Error");
        //"Expected value of type \"String!\", found null." - is one of graphQLErrors message
    });
});

describe("Facility Resolver Tests", () => {
    it("Resolver should not found facility given facility id, if does not exist", async () => {
        const facilityById = gql`
        query {
            facility(id: "KKKK") {
                id
            }
        }`;
        const { data } = await client.query({ query: facilityById });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.facility).toBeNull();
    });
});

// fix later per new search functionality
/*
describe("Facility Resolver Tests", () => {
    it("Resolver should not found facility in campus, if does not exist", async () => {
        const facilitiesInCampus = gql`
        query {
            facilitiesInCampus (campusCode: "KKKK", facilityType: "${FacilityType.Office}",
                                hotelingSite: true){
                id
            }
        }`;
        const { data } = await client.query({ query: facilitiesInCampus });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.facilitiesInCampus).toBeNull;
    });
});




describe("Facility Resolver Tests", () => {
    it("Resolver should return facilities in campus", async () => {
        const facilitiesInCampus = gql`
        query {
            facilitiesInCampus (campusCode: "${booz.campusCode}", 
                facilityType: "${FacilityType.Office}", hotelingSite: true){
                id,
                name,
                campusCode,
                address {street1, city, zipCode, stateCode, country},
                timeZone,
                location {type, coordinates},
                hotelingSite, facilityType,
                officeHours {day, openTime, closeTime},
                otherDetail,
                createdAt
            }
        }`;
        const { data } = await client.query({ query: facilitiesInCampus });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.facilitiesInCampus).toBeDefined();
        expect(data.facilitiesInCampus).not.toBeNull();
        FacilityComparator.compareIds(data.facilitiesInCampus[0], booz);
        let facility: Facility[] = data.facilitiesInCampus;
        FacilityComparator.compareAllFields(facility[0], booz);
        FacilityComparator.compareAllFields(facility[1], hamilton);
    });
});

*/