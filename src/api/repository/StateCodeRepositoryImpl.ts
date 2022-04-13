
import { StateCode, StateCodeModel } from "../model/StateCode";
import { StateCodeRepository } from "./StateCodeRepository";

export class StateCodeRepositoryImpl implements StateCodeRepository {

    async find(code: string): Promise<StateCode | null> {
        return await StateCodeModel.findOne({ code: code}).exec();
    }


   
}