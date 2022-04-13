import { assert } from "console";
import { AmenityType, AmenityTypeModel } from "../model/AmenityType";
import { AmenityTypeRepository } from "./AmenityTypeRepository";
import { logging } from "../util/log/LogManager";

export class AmenityTypeRepositoryImpl implements AmenityTypeRepository {
    private logger = logging.getLogger(AmenityTypeRepositoryImpl.name);

    async find(name: string): Promise<AmenityType | null> {
        return await AmenityTypeModel.findOne({name: name}).exec();
    }
    async findAll(): Promise<AmenityType[]> {
        var st = process.hrtime();
        let amenityType = await AmenityTypeModel.find().exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken AmenityTypeRepositoryImpl.findAll: " + elapsedSeconds);
        return amenityType;
    }
    
    async save(amenityType: AmenityType): Promise<AmenityType> {
        assert(amenityType);
        var st = process.hrtime();
        let result = await AmenityTypeModel.create(amenityType);
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken AmenityTypeRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(id: string, amenityType: AmenityType): Promise<AmenityType | null> {
        assert(amenityType);
        return await AmenityTypeModel.findByIdAndUpdate(id, amenityType, { new: true }).exec();
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let result = await AmenityTypeModel.findByIdAndDelete({_id:id}).exec();
        return result ? true : false;
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}