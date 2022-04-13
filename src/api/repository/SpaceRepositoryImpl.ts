import { assert } from "console";
import { Space, SpaceModel } from "../model/Space";
import { SpaceType } from "../model/SpaceType";
import { SpaceRepository } from "./SpaceRepository";
import { logging } from "../util/log/LogManager";

export class SpaceRepositoryImpl implements SpaceRepository {
    private logger = logging.getLogger(SpaceRepositoryImpl.name);

    async findByFacilityId(facilityId: string): Promise<Space[]> {
        var st = process.hrtime();
        let result = await SpaceModel.find({ facility: facilityId });
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken SpaceRepositoryImpl.findByFacilityId: " + elapsedSeconds);
        return result;
    }

    async findWithFacilityByFacilityId(facilityId: string): Promise<Space[]> {
        return await SpaceModel.find({ facility: facilityId })
            .populate("facility").exec();
    }

    async findByTypeFacilityId(name: string, facilityId: string): Promise<Space[] | null> {
        return await SpaceModel.find({ "type.name": name, facility: facilityId }).exec();
    }

    async spaceExists(name: string, desc: string, facilityId: string): Promise<boolean> {
        return await SpaceModel.exists({"type.name": name, desc: desc, facility: facilityId });
    }

    async findWithFacilityByTypeFacilityId(name: string, facilityId: string): Promise<Space[] | null> {
        return await SpaceModel.find({ "type.name": name, facility: facilityId })
            .populate("facility").exec();
    }

    async save(space: Space): Promise<Space> {
        assert(space);
        var st = process.hrtime();
        let result = await SpaceModel.create(space);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken SpaceRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, space: Space): Promise<Space | null> {
        assert(id);
        assert(space);
        return await SpaceModel.findByIdAndUpdate(id, space, { new: true }).exec();
    }

    async updateType(id: string, spaceType: SpaceType): Promise<any | null> {
        assert(id);
        assert(spaceType);
        return await SpaceModel.updateMany({ "type._id": id }, { "type.name": spaceType.name, "type.desc": spaceType.desc, "type.updatedAt": spaceType.updatedAt }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await SpaceModel.findByIdAndDelete({ _id: id }).exec();
        return result ? true : false;
    }

    async existsByTypeFacilityId(name: string, facilityId: string): Promise<boolean> {
        return await SpaceModel.exists({ "type.name": name, facility: facilityId });
    }

    async existsByTypeId(id: string): Promise<boolean> {
        return await SpaceModel.exists({ "type._id": id });
    }

    async deleteSpaceForFacility(facilityId: string): Promise<any | null> {
        let filter = {facility: facilityId.toUpperCase()};
        let spaceResponse = await SpaceModel.exists(filter);
        if (spaceResponse) {
            return await SpaceModel.remove({facility: {$in: [facilityId.toUpperCase()]}})
        }
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}