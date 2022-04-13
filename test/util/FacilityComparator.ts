import { Facility, FacilityType, OperationalStatus, ClassificationType } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";

export class FacilityComparator {

    /**
     * Compares all fields of a facility for equality.
     * @param received The facility from resulting call.
     * @param expected The facility to compare the result with.
     */
    static compareAllFields(received: Facility, expected: Facility): void {
        //In Resolver tests, _id is not present, compareIds() is used instead.
        if (received._id) {
            expect(received._id).toBe(expected._id);
        }
        expect(received.name).toBe(expected.name);
        expect(received.campusCode).toBe(expected.campusCode);
        expect(received.address).not.toBeNull();
        expect(received.address.street1).toBe(expected.address.street1);
        expect(received.address.city).toBe(expected.address.city);
        expect(received.address.zipCode).toBe(expected.address.zipCode);
        expect(received.address.stateCode).toBe(expected.address.stateCode);
        expect(received.address.state).toBe(expected.address.state);
        expect(received.address.countryCode).toBe(expected.address.countryCode);
        expect(received.address.country).toBe(expected.address.country);
        expect(received.timeZone).toBe(expected.timeZone);
        expect(received.location).not.toBeNull();
        expect(received.location!.type).toBe(CoordinateType.Point);
        expect(received.location!.coordinates).toHaveLength(expected.location!.coordinates.length);
        expect(received.location!.coordinates).toEqual(expect.arrayContaining(expected.location!.coordinates));

        expect(received.hotelingSite).toBe(expected.hotelingSite);
        expect(received.otherDetail).toBe(expected.otherDetail);
        expect(received.facilityType).toBe(FacilityType.OFFICE);
        expect(received.officeHours).not.toBeNull;
        expect(received.officeHours).toHaveLength(expected.officeHours.length);
        expect(received.officeHours[0].day).toBe(expected.officeHours[0].day);
        expect(received.officeHours[0].openTime).toBe(expected.officeHours[0].openTime);
        expect(received.officeHours[0].closeTime).toBe(expected.officeHours[0].closeTime);
        expect(received.createdAt).not.toBeNaN;
        expect(received.operationalStatus).toBe(OperationalStatus.OPEN);
        expect(received.classificationType).toBe(ClassificationType.CLEARED);
        //expect(received.createdAt).toBeInstanceOf(Date);

    }

    /**
     * Since the resolver returns the ids named "id" instead of the db's "_id",
     * this method covers that usecase.
     * @param recieved The facility from resulting call.
     * @param expected The facility to compare the result with.
     */
    static compareIds(recieved: any, expected: Facility): void {
        expect(recieved.id).toEqual(expected._id);
    }
}