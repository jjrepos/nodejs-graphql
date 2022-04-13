import { AmenityType } from "../../src/api/model/AmenityType";

export class AmenityTypeComparator {

    /**
     * Compares all fields of a transportation type.
     * @param received The amenity type from resulting call.
     * @param expected The amenity type to compare the result with.
     */
    static compareAllFields(received: AmenityType, expected: AmenityType): void {
        expect(received._id).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.desc).toBe(expected.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}