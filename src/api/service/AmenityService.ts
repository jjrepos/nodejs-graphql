import { assert } from "console";
import { Amenity } from "../model/Amenity";
import { AmenityRepository } from "../repository/AmenityRepository";
import { AmenityRepositoryImpl } from "../repository/AmenityRepositoryImpl";
import { AmenityTypeRepository } from "../repository/AmenityTypeRepository";
import { AmenityTypeRepositoryImpl } from "../repository/AmenityTypeRepositoryImpl";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";
import { AmenityInput } from "../resolver/types/input/AmenityInput";
import { OperationalHoursValidator } from "../repository/util/validator/OperationalHoursValidator";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";



export class AmenityService {
    private readonly repository: AmenityRepository = new AmenityRepositoryImpl();
    private readonly amenityTypeRepository: AmenityTypeRepository = new AmenityTypeRepositoryImpl();
    private readonly facilityRepository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly validator: OperationalHoursValidator = new OperationalHoursValidator();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getAllAmenities(facilityId: string): Promise<Amenity[]> {
        return await this.repository.findByFacilityId(facilityId);
    }

    async getAllAmenitiesWithFacility(facilityId: string): Promise<Amenity[]> {
        return await this.repository.findWithFacilityByFacilityId(facilityId);
    }

    async getAmenity(name: string, facilityId: string): Promise<Amenity[] | null> {
        return await this.repository.findByTypeFacilityId(name, facilityId);
    }

    async getAmenityWithFacility(name: string, facilityId: string): Promise<Amenity[] | null> {
        return await this.repository.findWithFacilityByTypeFacilityId(name, facilityId);
    }

    async save(input: AmenityInput): Promise<Amenity> {
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
        if(input.onsite) {
            let amenityResponse = await this.repository.findByTypeDescFacilityId(input.type, input.desc, input.facility);
            if (amenityResponse && amenityResponse.length > 0) {
                throw new Error("Amenity already exists with same amenity type, amenity description and facility");
            }
        }
        let type = await this.amenityTypeRepository.find(input.type);
        if (type) {
            let amenity = Amenity.withInput(input, type);
            let stringError = this.inputStringValidator.validate(amenity);
            if(stringError) {
                throw stringError;
            }
            if(!amenity.onsite) {
                let error = this.validator.validate(amenity.operationalHours!);
                if(error) {
                    throw error;
                }
                if(!amenity.address) {
                    throw new Error("Amenity address is missing.")
                }
            }
            return await this.repository.save(amenity);
        }
        throw new Error("AmenityType does not exist");
    }

    async update(id: string, input: AmenityInput): Promise<Amenity | null> {
        assert(id);
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
        if(!input.onsite) {
            let error = this.validator.validate(input.operationalHours!);
            if(error) {
                throw error;
            }
            if(!input.address) {
                throw new Error("Amenity address is missing.")
            }
        }
        let type = await this.amenityTypeRepository.find(input.type);
        if (type) {
            let amenity = Amenity.withIdInput(id, input, type);
            let stringError = this.inputStringValidator.validate(amenity);
            if(stringError) {
                throw stringError;
            }
            let amenityResponse = await this.repository.update(id, amenity);
            if (amenityResponse) {
                return amenityResponse;
            }
            throw new Error(`Unable to update amenity ${id}. Amenity not found.`);
        }
        throw new Error("AmenityType does not exist");
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let transportation = await this.repository.delete(id);
        if (!transportation) {
            throw new Error(`Unable to delete amenity ${id}. Amenity not found.`);
        }
        return transportation;

    }
}