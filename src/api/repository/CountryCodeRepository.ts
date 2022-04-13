import { CountryCode } from "../model/CountryCode";

export interface CountryCodeRepository {

    find(code: string): Promise<CountryCode | null>;

}