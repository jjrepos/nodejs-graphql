import { SpaceType } from "../../src/api/model/SpaceType";

export class SpaceTypeComparator {

    /**
     * Compares all fields of a space type.
     * @param received The space type from resulting call.
     * @param expected The space type to compare the result with.
     */
    static compareAllFields(received: SpaceType, expected: SpaceType): void {
        expect(received._id).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.desc).toBe(expected.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).toBeInstanceOf(Date);
    }
}