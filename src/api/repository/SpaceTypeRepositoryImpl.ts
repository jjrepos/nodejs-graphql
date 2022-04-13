import { assert } from "console";
import { SpaceType, SpaceTypeModel } from "../model/SpaceType";
import { SpaceTypeRepository } from "./SpaceTypeRepository";
import { logging } from "../util/log/LogManager";

export class SpaceTypeRepositoryImpl implements SpaceTypeRepository {
    private logger = logging.getLogger(SpaceTypeRepositoryImpl.name);

    async find(name: string): Promise<SpaceType | null> {
        return await SpaceTypeModel.findOne({name: name}).exec();
    }

    async findAll(): Promise<SpaceType[]> {
        var st = process.hrtime();
        let result = await SpaceTypeModel.find().exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken SpaceTypeRepositoryImpl.findAll: " + elapsedSeconds);
        return result;
    }

    async save(spaceType: SpaceType): Promise<SpaceType> {
        assert(spaceType);
        var st = process.hrtime();
        let result = await SpaceTypeModel.create(spaceType);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken SpaceTypeRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, spaceType: SpaceType): Promise<SpaceType | null> {
        assert(spaceType);
        return await SpaceTypeModel.findByIdAndUpdate(id, spaceType, { new: true }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await SpaceTypeModel.findByIdAndDelete({_id:id}).exec();
        return result ? true : false;
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}