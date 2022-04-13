import { StateCode, StateCodeModel } from "../../src/api/model/StateCode";
import { StateCodeRepository } from "../../src/api/repository/StateCodeRepository";
import { StateCodeRepositoryImpl } from "../../src/api/repository/StateCodeRepositoryImpl";

import { stateCodes, va } from "../data/StateCodes";
import { StateCodeComparator } from "../util/StateCodeComparator";

import { connection } from "mongoose";
const repo: StateCodeRepository = new StateCodeRepositoryImpl();


beforeAll(async () => {
    await connection.db.dropDatabase();
    await StateCodeModel.create(stateCodes);
});

describe("StateCode Repository Tests", () => {
    it("Repository should return state given state code", async () => {
        const stateCode: StateCode | null = await repo.find("VA");
        expect(stateCode).not.toBeNull();
        StateCodeComparator.compareAllFields(stateCode!, va);
    });
});



describe("StateCode Repository Tests", () => {
    it("StateCode should error to find a state, state should not exist with given state code", async () => {
        const stateCode: StateCode | null = await repo.find("AA");
        expect(stateCode).toBeNull();
    });

    
});