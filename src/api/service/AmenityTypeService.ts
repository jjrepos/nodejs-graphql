import { assert } from "console";
import { AmenityType } from "../model/AmenityType";
import { AmenityTypeRepository } from "../repository/AmenityTypeRepository";
import { AmenityTypeRepositoryImpl } from "../repository/AmenityTypeRepositoryImpl";
import { AmenityTypeInput } from "../resolver/types/input/AmenityTypeInput";
import { AmenityRepository } from "../repository/AmenityRepository";
import { AmenityRepositoryImpl } from "../repository/AmenityRepositoryImpl";
import { Transaction } from "../repository/util/Transaction";
import { logging } from "../util/log/LogManager";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";

export class AmenityTypeService {
    private logger = logging.getLogger(AmenityTypeService.name);
    private readonly amenityRepository: AmenityRepository = new AmenityRepositoryImpl();
    private readonly repository: AmenityTypeRepository = new AmenityTypeRepositoryImpl();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getAmenityType(name: string): Promise<AmenityType | null> {
        return await this.repository.find(name);
    }

    async getAllAmenityTypes(): Promise<AmenityType[]> {
        return await this.repository.findAll();
    }

    async save(input: AmenityTypeInput): Promise<AmenityType> {
        assert(input);
        let type = await this.getAmenityType(input.name);
        if (type) {
            throw new Error("Amenity type already exists");
        }
        let amenityType = AmenityType.withInput(input);
        let stringError = this.inputStringValidator.validate(amenityType);
        if(stringError) {
            throw stringError;
        }
        return await this.repository.save(amenityType);
    }

    @Transaction
    async update(id: string, input: AmenityTypeInput): Promise<AmenityType | null> {
        assert(id);
        assert(input);
        let amenityType = AmenityType.withIdInput(id, input);
        let stringError = this.inputStringValidator.validate(amenityType);
        if(stringError) {
            throw stringError;
        }
        let type = await this.repository.update(id, amenityType);
        this.logger.debug("Type is: " + type);
        if (!type) {
            throw new Error(`Unable to update amenity type ${id}. Amenity type not found.`);
        }
        await this.amenityRepository.updateType(id, type);
        return type;
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let amenityExists = await this.amenityRepository.existsByTypeId(id);
        if (amenityExists) {
            throw new Error("Cannot delete type - has associated amenities");
        }
        let type = await this.repository.delete(id);
        if (!type) {
            throw new Error(`Unable to delete amenity type ${id}. Amenity type not found.`);
        }
        return type;
    }
}