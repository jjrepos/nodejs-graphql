import { Facility } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";
import { Operation } from "../../src/api/model/Operation";
import { OperationType } from "../../src/api/model/OperationType";
import { OperationOutput } from "../../src/api/resolver/types/output/OperationOutput";

export class OperationComparator {

    /**
     * Compares all fields of a operation.
     * @param received The operation from resulting call.
     * @param expectedOperation The operation to compare the result with.
     * @param type The operation type to compare the result with.
     */
    static compareAllFields(received: Operation, expectedOperation: Operation, type: OperationType): void {
        expect(received._id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type._id).not.toBeNull;
        expect(received.type.name).toBe(type.name);
        expect(received.type.desc).toBe(type.desc);
        expect(received.desc).toBe(expectedOperation.desc);
        expect(received.email).toBe(expectedOperation.email);
        expect(received.phone).toBe(expectedOperation.phone);
        expect(received.poc).toBe(expectedOperation.poc);
        expect(received.room).toBe(expectedOperation.room);
        expect(received.url).toBe(expectedOperation.url);
        expect(received.facility!).toBe(expectedOperation.facility);

        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedOperation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedOperation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedOperation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedOperation.operationalHours![0].closeTime);
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
    
     static compareAllFieldsWithFacility(received: Operation, expected: Operation, type: OperationType, facility: Facility): void {
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
        expect(received.desc).toBe(expected.desc);
        expect(received.email).toBe(expected.email);
        expect(received.phone).toBe(expected.phone);
        expect(received.poc).toBe(expected.poc);
        expect(received.room).toBe(expected.room);
        expect(received.url).toBe(expected.url);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expected.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expected.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expected.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expected.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a operation from resolver test.
     * @param received The operation from resulting call.
     * @param expectedOperation The operation to compare the result with.
     * @param type The operation type to compare the result with.
     */

     
    static compareAllFieldsFromResolver(received: OperationOutput, expectedOperation: Operation, type: OperationType): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.desc).toBe(expectedOperation.desc);
        expect(received.email).toBe(expectedOperation.email);
        expect(received.phone).toBe(expectedOperation.phone);
        expect(received.poc).toBe(expectedOperation.poc);
        expect(received.room).toBe(expectedOperation.room);
        expect(received.url).toBe(expectedOperation.url);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expectedOperation.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expectedOperation.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expectedOperation.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expectedOperation.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a operation from resolver test.
     * @param received The operation from resulting call.
     * @param expected The operation to compare the result with.
     * @param facility The facility to compare the result with.
     * @param type The operation type to compare the result with.
     */

     
    static compareAllFieldsWithFacilityFromResolver(received: OperationOutput, expected: Operation, type: OperationType, facility: Facility): void {
        expect(received.id).not.toBeNull;
        expect(received.type).not.toBeNull;
        expect(received.type).toBe(type.name);
        expect(received.facility).not.toBeNull;
       // expect((<Facility>received.facility!.valueOf())._id).toBe(facility._id);
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
        expect(received.desc).toBe(expected.desc);
        expect(received.room).toBe(expected.room);
        expect(received.poc).toBe(expected.poc);
        expect(received.operationalHours).not.toBeNull;
        expect(received.operationalHours).toHaveLength(expected.operationalHours!.length);
        expect(received.operationalHours![0].day).toBe(expected.operationalHours![0].day);
        expect(received.operationalHours![0].openTime).toBe(expected.operationalHours![0].openTime);
        expect(received.operationalHours![0].closeTime).toBe(expected.operationalHours![0].closeTime);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    
}