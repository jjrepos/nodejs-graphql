import { assert } from "console";
import { SpaceType } from "../model/SpaceType";
import { SpaceTypeRepository } from "../repository/SpaceTypeRepository";
import { SpaceTypeRepositoryImpl } from "../repository/SpaceTypeRepositoryImpl";
import { SpaceTypeInput } from "../resolver/types/input/SpaceTypeInput";
import { SpaceRepository } from "../repository/SpaceRepository";
import { SpaceRepositoryImpl } from "../repository/SpaceRepositoryImpl";
import { Transaction } from "../repository/util/Transaction";
import { logging } from "../util/log/LogManager";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";

export class SpaceTypeService {
    private logger = logging.getLogger(SpaceTypeService.name);
    private readonly spaceRepository: SpaceRepository = new SpaceRepositoryImpl();
    private readonly repository: SpaceTypeRepository = new SpaceTypeRepositoryImpl();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getSpaceType(name: string): Promise<SpaceType | null> {
        return await this.repository.find(name);
    }

    async getAllSpaceTypes(): Promise<SpaceType[]> {
        return await this.repository.findAll();
    }

    async save(input: SpaceTypeInput): Promise<SpaceType> {
        assert(input);
        let type = await this.getSpaceType(input.name);
        if (type) {
            throw new Error("Space type already exists");
        }
        let spaceType = SpaceType.withInput(input);
        let stringError = this.inputStringValidator.validate(spaceType);
        if(stringError) {
            throw stringError;
        }
        return await this.repository.save(spaceType);
    }

    @Transaction
    async update(id: string, input: SpaceTypeInput): Promise<SpaceType | null> {
        assert(id);
        assert(input);
        let spaceType = SpaceType.withIdInput(id, input);
        let stringError = this.inputStringValidator.validate(spaceType);
        if(stringError) {
            throw stringError;
        }
        let type = await this.repository.update(id, spaceType);
        this.logger.debug("Type is: " + type);
        if (!type) {
            throw new Error(`Unable to update space type ${id}. Space type not found.`);
        }
        await this.spaceRepository.updateType(id, type);
        return type;
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let spaceExists = await this.spaceRepository.existsByTypeId(id);
        if (spaceExists) {
            throw new Error("Cannot delete type - has associated spaces");
        }
        let type = await this.repository.delete(id);
        if (!type) {
            throw new Error(`Unable to delete space type ${id}. Space type not found.`);
        }
        return type;
    }
}