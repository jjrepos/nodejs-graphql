import { StateCode } from "../../src/api/model/StateCode";

export class StateCodeComparator {

    /**
     * Compares all fields of a state code.
     * @param received The state code from resulting call.
     * @param expected The state code to compare the result with.
     */
    static compareAllFields(received: any, expected: StateCode): void {
        expect(received.code).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.code).toBe(expected.code);
    }

}