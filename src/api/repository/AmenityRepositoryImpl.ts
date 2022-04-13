import { assert } from "console";
import { Amenity, AmenityModel } from "../model/Amenity";
import { AmenityType } from "../model/AmenityType";
import { AmenityRepository } from "./AmenityRepository";
import { Address } from "../model/Address";
import { logging } from "../util/log/LogManager";

export class AmenityRepositoryImpl implements AmenityRepository {
    private logger = logging.getLogger(AmenityRepositoryImpl.name);

    async findByFacilityId(facilityId: string): Promise<Amenity[]> {
        var st = process.hrtime();
        let amenity = await AmenityModel.find({ facility: facilityId });
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken AmenityRepositoryImpl.findByFacilityId: " + elapsedSeconds);
        return amenity;
    }

    async findWithFacilityByFacilityId(facilityId: string): Promise<Amenity[]> {
        var st = process.hrtime();
        let amenity = await AmenityModel.find({ facility: facilityId })
            .populate("facility").exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken AmenityRepositoryImpl.findWithFacilityByFacilityId: " + elapsedSeconds);
        return amenity;
    }

    async findByTypeFacilityId(name: string, facilityId: string): Promise<Amenity[] | null> {
        return await AmenityModel.find({ "type.name": name, facility: facilityId }).exec();
    }

    async findWithFacilityByTypeFacilityId(name: string, facilityId: string): Promise<Amenity[] | null> {
        return await AmenityModel.find({ "type.name": name, facility: facilityId })
            .populate("facility").exec();
    }

    async findByTypeDescFacilityId(name: string, desc: string, facilityId: string): Promise<Amenity[] | null> {
        return await AmenityModel.find({ "type.name": name, desc: desc, facility: facilityId }).exec();
    }

    async findByTypeFacilityIdAddress(name: string, facilityId: string, address: Address): Promise<Amenity[] | null> {
        return await AmenityModel.find({ "type.name": name, facility: facilityId, address: address }).exec();
    }

    async deleteAmenityForFacility(facilityId: string): Promise<any | null> {
        let filter = {facility: facilityId};
        let amenityResponse = await AmenityModel.exists(filter);
        if (amenityResponse) {
            return await AmenityModel.remove({facility: {$in: [facilityId]}})
        }
    }

    async save(amenity: Amenity): Promise<Amenity> {
        assert(amenity);
        var st = process.hrtime();
        let result = await AmenityModel.create(amenity);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken AmenityRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, amenity: Amenity): Promise<Amenity | null> {
        assert(id);
        assert(amenity);
        return await AmenityModel.findByIdAndUpdate(id, amenity, { new: true }).exec();
    }

    async updateType(id: string, amenityType: AmenityType): Promise<any | null> {
        assert(id);
        assert(amenityType);
        return await AmenityModel.updateMany({ "type._id": id }, { "type.name": amenityType.name, "type.desc": amenityType.desc, "type.updatedAt": amenityType.updatedAt }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await AmenityModel.findByIdAndDelete({ _id: id }).exec();
        return result ? true : false;
    }

    async existsByTypeId(id: string): Promise<boolean> {
        return await AmenityModel.exists({ "type._id": id });
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}