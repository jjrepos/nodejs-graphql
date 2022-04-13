import { CountryCode, CountryCodeModel } from "../../src/api/model/CountryCode";
import { CountryCodeRepository } from "../../src/api/repository/CountryCodeRepository";
import { CountryCodeRepositoryImpl } from "../../src/api/repository/CountryCodeRepositoryImpl";

import { countryCodes, usa } from "../data/CountryCodes";
import { CountryCodeComparator } from "../util/CountryCodeComparator";
import { connection } from "mongoose";

const repo: CountryCodeRepository = new CountryCodeRepositoryImpl();

beforeAll(async () => {
    await connection.db.dropDatabase();
    await CountryCodeModel.create(countryCodes);
});

describe("CountryCode Repository Tests", () => {
    it("Repository should return country given country code", async () => {
        const countryCode: CountryCode | null = await repo.find("USA");
        expect(countryCode).not.toBeNull();
        CountryCodeComparator.compareAllFields(countryCode!, usa);
    });
});



describe("CountryCode Repository Tests", () => {
    it("CountryCode should error to find a country, country should not exist with given country code", async () => {
        const countryCode: CountryCode | null = await repo.find("AAA");
        expect(countryCode).toBeNull();
    });

    
});