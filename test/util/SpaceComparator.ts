import { Facility } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";
import { Space } from "../../src/api/model/Space";
import { SpaceType } from "../../src/api/model/SpaceType";
import { SpaceOutput } from "../../src/api/resolver/types/output/SpaceOutput";

export class SpaceComparator {

    /**
     * Compares all fields of a space.
     * @param received The space from resulting call.
     * @param expectedSpace The space to compare the result with.
     * @param type The space type to compare the result with.
     */
    static compareAllFields(received: Space, expectedSpace: Space, type: SpaceType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.desc).toBe(expectedSpace.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a space.
     * @param received The space from resulting call.
     * @param expectedSpace The space to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The space type to compare the result with.
     */
    static compareAllFieldsWithFacility(received: Space, expectedSpace: Space, facility: Facility, type: SpaceType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.desc).toBe(expectedSpace.desc);
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
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a space from resolver test.
     * @param received The space from resulting call.
     * @param expectedSpace The space to compare the result with.
     * @param type The space type to compare the result with.
     */
    static compareAllFieldsFromResolver(received: SpaceOutput, expectedSpace: Space, type: SpaceType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.desc).toBe(expectedSpace.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a space from resolver test.
     * @param received The space from resulting call.
     * @param expectedSpace The space to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The space type to compare the result with.
     */
    static compareAllFieldsWithFacilityFromResolver(received: SpaceOutput, expectedSpace: Space, facility: Facility, type: SpaceType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.desc).toBe(expectedSpace.desc);
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
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}