
import { CountryCode, CountryCodeModel } from "../model/CountryCode";
import { CountryCodeRepository } from "./CountryCodeRepository";

export class CountryCodeRepositoryImpl implements CountryCodeRepository {

    async find(code: string): Promise<CountryCode | null> {
        return await CountryCodeModel.findOne({ code: code}).exec();
    }
}