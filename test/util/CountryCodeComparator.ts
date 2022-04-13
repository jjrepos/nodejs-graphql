import { CountryCode } from "../../src/api/model/CountryCode";

export class CountryCodeComparator {

    /**
     * Compares all fields of a country code.
     * @param received The country code from resulting call.
     * @param expected The country code to compare the result with.
     */
    static compareAllFields(received: any, expected: CountryCode): void {
        expect(received.code).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.code).toBe(expected.code);
    }

}