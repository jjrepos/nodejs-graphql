import { Facility } from "../../src/api/model/Facility";
import { CoordinateType } from "../../src/api/model/Location";
import { Notification } from "../../src/api/model/Notification";
import { NotificationOutput } from "../../src/api/resolver/types/output/NotificationOutput";

export class NotificationComparator {

    /**
     * Compares all fields of a notification.
     * @param received The notification from resulting call.
     * @param expected The notification to compare the result with.
     */
    static compareAllFields(received: Notification, expected: Notification): void {
        expect(received._id).not.toBeNull;
        expect(received.desc).toBe(expected.desc);
        expect(received.title).toBe(expected.title);

        let expectedStartsOn: Date = new Date(expected.startsOn);
        let expectedEndsOn: Date = new Date(expected.endsOn!);
        expect(received.startsOn.toJSON()).toBe(expectedStartsOn.toJSON());
        expect(received.endsOn!.toJSON()).toBe(expectedEndsOn.toJSON());

        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /** 
     * Compares all fields of a notification.
     * @param received The notification from resulting call.
     * @param expected The notification to compare the result with.
     * @param facility The facility to compare the result with.
     */
    
     static compareAllFieldsWithFacility(received: Notification, expected: Notification, facility: Facility): void {
        expect(received._id).not.toBeNull;
        expect(received.desc).toBe(expected.desc);
        expect(received.title).toBe(expected.title);

        let expectedStartsOn: Date = new Date(expected.startsOn);
        let expectedEndsOn: Date = new Date(expected.endsOn!);
        expect(received.startsOn.toJSON()).toBe(expectedStartsOn.toJSON());
        expect(received.endsOn!.toJSON()).toBe(expectedEndsOn.toJSON());

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
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }

    /**
     * Compares all fields of a notification from resolver test.
     * @param received The notification from resulting call.
     * @param expected The notification to compare the result with.
     */

    static compareAllFieldsFromResolver(received: NotificationOutput, expected: Notification): void {
        expect(received.id).not.toBeUndefined;
        expect(received.desc).toBe(expected.desc);
        expect(received.title).toBe(expected.title);
        
        let expectedStartsOn: Date = new Date(expected.startsOn);
        let expectedEndsOn: Date = new Date(expected.endsOn!);
        expect(received.startsOn).toBe(expectedStartsOn.toJSON());
        expect(received.endsOn!).toBe(expectedEndsOn.toJSON());
        expect(received.createdAt).not.toBeNull;
    }

    /**
     * Compares all fields of a notification from resolver test.
     * @param received The notification from resulting call.
     * @param expected The notification to compare the result with.
     * @param facility The facility to compare the result with.
     */

     
    static compareAllFieldsWithFacilityFromResolver(received: NotificationOutput, expected: Notification, facility: Facility): void {
        expect(received.id).not.toBeNull;
        expect(received.desc).toBe(expected.desc);
        expect(received.title).toBe(expected.title);

        let expectedStartsOn: Date = new Date(expected.startsOn);
        let expectedEndsOn: Date = new Date(expected.endsOn!);
        expect(received.startsOn).toBe(expectedStartsOn.toJSON());
        expect(received.endsOn!).toBe(expectedEndsOn.toJSON());
       
        //expect((<Facility>received.facility!.valueOf())._id).toBe(facility._id);
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
    }

    
}