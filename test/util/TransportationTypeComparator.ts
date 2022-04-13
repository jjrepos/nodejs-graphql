import { TransportationType } from "../../src/api/model/TransportationType";

export class TransportationTypeComparator {

    /**
     * Compares all fields of a transportation type.
     * @param received The transportation type from resulting call.
     * @param expected The transportation type to compare the result with.
     */
    static compareAllFields(received: TransportationType, expected: TransportationType): void {
        expect(received._id).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.desc).toBe(expected.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}