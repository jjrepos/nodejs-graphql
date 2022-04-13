import { assert } from "console";
import { Operation, OperationModel } from "../model/Operation";
import { OperationType } from "../model/OperationType";
import { OperationRepository } from "./OperationRepository";
import { logging } from "../util/log/LogManager";


export class OperationRepositoryImpl implements OperationRepository {
    private logger = logging.getLogger(OperationRepositoryImpl.name);

    async findByFacilityId(facilityId: string): Promise<Operation[]> {
        var st = process.hrtime();
        let result = await OperationModel.find({ facility: facilityId });
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken OperationRepositoryImpl.findByFacilityId: " + elapsedSeconds);
        return result;
    }

    async findWithFacilityByFacilityId(facilityId: string): Promise<Operation[]> {
        return await OperationModel.find({ facility: facilityId })
            .populate("facility").exec();
    }

    async findByOperationTypeFacilityId(name: string, facilityId: string): Promise<Operation[] | null> {
        return await OperationModel.find({ "type.name": name, facility: facilityId }).exec();
    }

    async operationExists(name: string, desc: string, facilityId: string): Promise<boolean> {
        return await OperationModel.exists({"type.name": name, desc: desc, facility: facilityId });
    }

    async findWithFacilityByOperationTypeFacilityId(name: string, facilityId: string): Promise<Operation[] | null> {
        return await OperationModel.find({ "type.name": name, facility: facilityId })
            .populate("facility").exec();
    }


    async findByTypeId(id: string): Promise<Operation[] | null> {
        return await OperationModel.find({ "type._id": id }).exec();
    }

    async deleteOperationForFacility(facilityId: string): Promise<any | null> {
        let filter = {facility: facilityId.toUpperCase()};
        let operationResponse = await OperationModel.exists(filter);
        if (operationResponse) {
            return await OperationModel.remove({facility: {$in: [facilityId.toUpperCase()]}})
        }
    }

    async save(operation: Operation): Promise<Operation> {
        assert(operation);
        var st = process.hrtime();
        let result = await OperationModel.create(operation);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken OperationRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, operation: Operation): Promise<Operation | null> {
        assert(id);
        assert(operation);
        return await OperationModel.findByIdAndUpdate(id, operation, { new: true }).exec();
    }

    async updateType(id: string, operationType: OperationType): Promise<any | null> {
        assert(id);
        assert(operationType);
        return await OperationModel.updateMany({ "type._id": id }, { "type.name": operationType.name, "type.desc": operationType.desc, "type.updatedAt": operationType.updatedAt }).exec();
    }

    async delete(id: string): Promise<boolean> {
        assert(id);
        let response =  await OperationModel.findByIdAndDelete({ _id: id }).exec();
        return response ? true : false;
    }

    async existsByTypeId(id: string): Promise<boolean> {
        return await OperationModel.exists({ "type._id": id });
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}