import { Facility } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";
import { Amenity } from "../../src/api/model/Amenity";
import { AmenityType } from "../../src/api/model/AmenityType";
import { AmenityOutput } from "../../src/api/resolver/types/output/AmenityOutput";

export class AmenityComparator {

    /**
     * Compares all fields of a amenity.
     * @param received The amenity from resulting call.
     * @param expectedTransportation The amenity to compare the result with.
     * @param type The amenity type to compare the result with.
     */
    static compareAllFields(received: Amenity, expectedAmenity: Amenity, type: AmenityType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.desc).toBe(expectedAmenity.desc);
        expect(received.onsite).toBe(expectedAmenity.onsite);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a amenity.
     * @param received The amenity from resulting call.
     * @param expectedAmenity The amenity to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The amenity type to compare the result with.
     */
    static compareAllFieldsWithFacility(received: Amenity, expectedAmenity: Amenity, facility: Facility, type: AmenityType): void {
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
        expect(received.desc).toBe(expectedAmenity.desc);
        expect(received.onsite).toBe(expectedAmenity.onsite);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a amenity.
     * @param received The amenity from resulting call in AmenityOutput.
     * @param expectedTransportation The amenity to compare the result with.
     * @param type The amenity type to compare the result with.
     */
    static compareAllFieldsFromResolver(received: AmenityOutput, expectedAmenity: Amenity, type: AmenityType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.desc).toBe(expectedAmenity.desc);
        expect(received.onsite).toBe(expectedAmenity.onsite);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a amenity.
     * @param received The amenity from resulting call in AmenityOutput.
     * @param expectedAmenity The amenity to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The amenity type to compare the result with.
     */
    static compareAllFieldsWithFacilityFromResolver(received: AmenityOutput, expectedAmenity: Amenity, facility: Facility, type: AmenityType): void {
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
        expect(received.desc).toBe(expectedAmenity.desc);
        expect(received.onsite).toBe(expectedAmenity.onsite);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}