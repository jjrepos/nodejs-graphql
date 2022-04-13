import { assert } from "console";
import { Space } from "../model/Space";
import { SpaceRepository } from "../repository/SpaceRepository";
import { SpaceRepositoryImpl } from "../repository/SpaceRepositoryImpl";
import { SpaceTypeRepository } from "../repository/SpaceTypeRepository";
import { SpaceTypeRepositoryImpl } from "../repository/SpaceTypeRepositoryImpl";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";
import { SpaceInput } from "../resolver/types/input/SpaceInput";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";

export class SpaceService {
    private readonly repository: SpaceRepository = new SpaceRepositoryImpl();
    private readonly spaceTypeRepository: SpaceTypeRepository = new SpaceTypeRepositoryImpl();
    private readonly facilityRepository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getAllSpaces(facilityId: string): Promise<Space[]> {
        return await this.repository.findByFacilityId(facilityId);
    }

    async getAllSpacesWithFacility(facilityId: string): Promise<Space[]> {
        return await this.repository.findWithFacilityByFacilityId(facilityId);
    }

    async getSpace(name: string, facilityId: string): Promise<Space[] | null> {
        return await this.repository.findByTypeFacilityId(name, facilityId);
    }

    async getSpaceWithFacility(name: string, facilityId: string): Promise<Space[] | null> {
        return await this.repository.findWithFacilityByTypeFacilityId(name, facilityId);
    }

    async save(input: SpaceInput): Promise<Space> {
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
       

        let type = await this.spaceTypeRepository.find(input.type);
        if (type) {
            let space = Space.withInput(input, type);
            let stringError = this.inputStringValidator.validate(space);
            if(stringError) {
                throw stringError;
            }
            let spaceExist = await this.repository.spaceExists(input.type, input.desc, input.facility);
            
            if (spaceExist) {
                throw new Error("Space already exists with same space type, space description and facility");
            }
            return await this.repository.save(space);
        }
        throw new Error("SpaceType does not exist");
    }

    async update(id: string, input: SpaceInput): Promise<Space | null> {
        assert(id);
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
        let type = await this.spaceTypeRepository.find(input.type);
        if (type) {
            let space = Space.withIdInput(id, input, type);
            let stringError = this.inputStringValidator.validate(space);
            if(stringError) {
                throw stringError;
            }
            let spaceResponse = await this.repository.update(id, space);
            if (spaceResponse) {
                return spaceResponse;
            }
            throw new Error(`Unable to update space ${id}. Space not found.`);
        }
        throw new Error("SpaceType does not exist");
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let space = await this.repository.delete(id);
        if (!space) {
            throw new Error(`Unable to delete space ${id}. Space not found.`);
        }
        return space;

    }
}