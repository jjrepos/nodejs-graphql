import { Facility } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";
import { Transportation } from "../../src/api/model/Transportation";
import { TransportationType } from "../../src/api/model/TransportationType";
import { TransportationOutput } from "../../src/api/resolver/types/output/TransportationOutput";

export class TransportationComparator {

    /**
     * Compares all fields of a transportation.
     * @param received The transportation from resulting call.
     * @param expectedTransportation The transportation to compare the result with.
     * @param type The transportation type to compare the result with.
     */
    static compareAllFields(received: Transportation, expectedTransportation: Transportation, type: TransportationType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.desc).toBe(expectedTransportation.desc);
        expect(received.onsite).toBe(expectedTransportation.onsite);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedTransportation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedTransportation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedTransportation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedTransportation.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a transportation.
     * @param received The transportation from resulting call.
     * @param expectedTransportation The transportation to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The transportation type to compare the result with.
     */
    static compareAllFieldsWithFacility(received: Transportation, expectedTransportation: Transportation, facility: Facility, type: TransportationType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.facility).not.toBeNull;
        expect((<Facility>received.facility!.valueOf())._id).toBe(facility._id);
        expect((<Facility>received.facility!.valueOf()).campusCode).toBe(facility.campusCode);
        expect((<Facility>received.facility!.valueOf()).address).not.toBeNull();
        expect((<Facility>received.facility!.valueOf()).address.street1).toBe(facility.address.street1);
        expect((<Facility>received.facility!.valueOf()).address.city).toBe(facility.address.city);
        expect((<Facility>received.facility!.valueOf()).address.zipCode).toBe(facility.address.zipCode);
        expect((<Facility>received.facility!.valueOf()).address.stateCode).toBe(facility.address.stateCode);
        expect((<Facility>received.facility!.valueOf()).location).not.toBeNull();
        expect((<Facility>received.facility!.valueOf()).location!.type).toBe(CoordinateType.Point);
        expect((<Facility>received.facility!.valueOf()).location!.coordinates).toHaveLength(facility.location!.coordinates.length);
        expect((<Facility>received.facility!.valueOf()).location!.coordinates).toEqual(expect.arrayContaining(facility.location!.coordinates));
        expect(received.desc).toBe(expectedTransportation.desc);
        expect(received.onsite).toBe(expectedTransportation.onsite);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedTransportation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedTransportation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedTransportation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedTransportation.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a transportation from resolver test.
     * @param received The transportation from resulting call.
     * @param expectedTransportation The transportation to compare the result with.
     * @param type The transportation type to compare the result with.
     */
    static compareAllFieldsFromResolver(received: TransportationOutput, expectedTransportation: Transportation, type: TransportationType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.desc).toBe(expectedTransportation.desc);
        expect(received.onsite).toBe(expectedTransportation.onsite);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedTransportation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedTransportation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedTransportation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedTransportation.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a transportation from resolver test.
     * @param received The transportation from resulting call.
     * @param expectedTransportation The transportation to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The transportation type to compare the result with.
     */
    static compareAllFieldsWithFacilityFromResolver(received: TransportationOutput, expectedTransportation: Transportation, facility: Facility, type: TransportationType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.facility).not.toBeNull;
        expect((<Facility>received.facility!.valueOf())._id).toBe(facility._id);
        expect((<Facility>received.facility!.valueOf()).campusCode).toBe(facility.campusCode);
        expect((<Facility>received.facility!.valueOf()).address).not.toBeNull();
        expect((<Facility>received.facility!.valueOf()).address.street1).toBe(facility.address.street1);
        expect((<Facility>received.facility!.valueOf()).address.city).toBe(facility.address.city);
        expect((<Facility>received.facility!.valueOf()).address.zipCode).toBe(facility.address.zipCode);
        expect((<Facility>received.facility!.valueOf()).address.stateCode).toBe(facility.address.stateCode);
        expect((<Facility>received.facility!.valueOf()).location).not.toBeNull();
        expect((<Facility>received.facility!.valueOf()).location!.type).toBe(CoordinateType.Point);
        expect((<Facility>received.facility!.valueOf()).location!.coordinates).toHaveLength(facility.location!.coordinates.length);
        expect((<Facility>received.facility!.valueOf()).location!.coordinates).toEqual(expect.arrayContaining(facility.location!.coordinates));
        expect(received.desc).toBe(expectedTransportation.desc);
        expect(received.onsite).toBe(expectedTransportation.onsite);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedTransportation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedTransportation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedTransportation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedTransportation.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}