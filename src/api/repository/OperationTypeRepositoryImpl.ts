import { assert } from "console";
import { OperationType, OperationTypeModel } from "../model/OperationType";
import { OperationTypeRepository } from "./OperationTypeRepository";
import { logging } from "../util/log/LogManager";

export class OperationTypeRepositoryImpl implements OperationTypeRepository {
    private logger = logging.getLogger(OperationTypeRepositoryImpl.name);

    async find(name: string): Promise<OperationType | null> {
        return await OperationTypeModel.findOne({name: name.toUpperCase()}).exec();
    }
    async findAll(): Promise<OperationType[]> {
        var st = process.hrtime();
        let operationType = await OperationTypeModel.find().exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken OperationTypeRepositoryImpl.findAll: " + elapsedSeconds);
        return operationType;
    }
    
    async save(operationType: OperationType): Promise<OperationType> {
        assert(operationType);
        var st = process.hrtime();
        let result = await OperationTypeModel.create(operationType);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken OperationTypeRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, operationType: OperationType): Promise<OperationType | null> {
        assert(operationType);
        return await OperationTypeModel.findByIdAndUpdate(id, operationType, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        assert(id);
        let response =  await OperationTypeModel.findByIdAndDelete({_id:id.toUpperCase()}).exec();
        return response ? true : false;
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}