import { assert } from "console";
import { Address } from "../model/Address";
import { Transportation, TransportationModel } from "../model/Transportation";
import { TransportationType } from "../model/TransportationType";
import { TransportationRepository } from "./TransportationRepository";

export class TransportationRepositoryImpl implements TransportationRepository {
    async findByFacilityId(facilityId: string): Promise<Transportation[]> {
        return await TransportationModel.find({ facility: facilityId });
    }

    async findWithFacilityByFacilityId(facilityId: string): Promise<Transportation[]> {
        return await TransportationModel.find({ facility: facilityId })
            .populate("facility").exec();
    }

    async findByTypeFacilityId(name: string, facilityId: string): Promise<Transportation[] | null> {
        return await TransportationModel.find({ "type.name": name, facility: facilityId }).exec();
    }

    async findWithFacilityByTypeFacilityId(name: string, facilityId: string): Promise<Transportation[] | null> {
        return await TransportationModel.find({ "type.name": name, facility: facilityId })
            .populate("facility").exec();
    }

    async findByTypeFacilityIdAddress(name: string, facilityId: string, address: Address): Promise<Transportation[] | null> {
        return await TransportationModel.find({ "type.name": name, facility: facilityId, address: address }).exec();
    }

    async findByTypeId(id: string): Promise<Transportation[] | null> {
        return await TransportationModel.find({ "type._id": id }).exec();
    }

    async deleteTransportaionForFacility(facilityId: string): Promise<any | null> {
        let filter = {facility: facilityId};
        let transportationResponse = await TransportationModel.exists(filter);
        if (transportationResponse) {
            return await TransportationModel.remove({facility: {$in: [facilityId]}})
        }
    }

    async save(transportation: Transportation): Promise<Transportation> {
        assert(transportation);
        return await TransportationModel.create(transportation);
    }

    async update(id: string, transportation: Transportation): Promise<Transportation | null> {
        assert(id);
        assert(transportation);
        return await TransportationModel.findByIdAndUpdate(id, transportation, { new: true }).exec();
    }

    async updateType(id: string, transportationType: TransportationType): Promise<any | null> {
        assert(id);
        assert(transportationType);
        return await TransportationModel.updateMany({ "type._id": id }, { "type.name": transportationType.name, "type.desc": transportationType.desc, "type.updatedAt": transportationType.updatedAt }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await TransportationModel.findByIdAndDelete({ _id: id }).exec();
        return result ? true : false;
    }

    async existsByTypeId(id: string): Promise<boolean> {
        return await TransportationModel.exists({ "type._id": id });
    }
}