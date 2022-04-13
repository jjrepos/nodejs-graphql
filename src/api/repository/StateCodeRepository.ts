import { StateCode } from "../model/StateCode";

export interface StateCodeRepository {

    find(code: string): Promise<StateCode | null>;

}