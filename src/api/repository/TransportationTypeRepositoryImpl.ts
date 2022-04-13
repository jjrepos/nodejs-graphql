import { assert } from "console";
import { TransportationType, TransportationTypeModel } from "../model/TransportationType";
import { TransportationTypeRepository } from "./TransportationTypeRepository";

export class TransportationTypeRepositoryImpl implements TransportationTypeRepository {

    async find(name: string): Promise<TransportationType | null> {
        return await TransportationTypeModel.findOne({name: name}).exec();
    }
    async findAll(): Promise<TransportationType[]> {
        return await TransportationTypeModel.find().exec();
    }
    
    async save(transportationType: TransportationType): Promise<TransportationType> {
        assert(transportationType);
        return await TransportationTypeModel.create(transportationType);
    }

    async update(id: string, transportationType: TransportationType): Promise<TransportationType | null> {
        assert(transportationType);
        return await TransportationTypeModel.findByIdAndUpdate(id, transportationType, { new: true }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await TransportationTypeModel.findByIdAndDelete({_id:id}).exec();
        return result ? true : false;
    }
}