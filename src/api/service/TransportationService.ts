import { assert } from "console";
import { Transportation } from "../model/Transportation";
import { TransportationRepository } from "../repository/TransportationRepository";
import { TransportationRepositoryImpl } from "../repository/TransportationRepositoryImpl";
import { TransportationTypeRepository } from "../repository/TransportationTypeRepository";
import { TransportationTypeRepositoryImpl } from "../repository/TransportationTypeRepositoryImpl";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";
import { TransportationInput } from "../resolver/types/input/TransportationInput";
import { OperationalHoursValidator } from "../repository/util/validator/OperationalHoursValidator";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";



export class TransportationService {
    private readonly repository: TransportationRepository = new TransportationRepositoryImpl();
    private readonly transportationTypeRepository: TransportationTypeRepository = new TransportationTypeRepositoryImpl();
    private readonly facilityRepository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly validator: OperationalHoursValidator = new OperationalHoursValidator();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getAllTransportations(facilityId: string): Promise<Transportation[]> {
        return await this.repository.findByFacilityId(facilityId);
    }

    async getAllTransportationsWithFacility(facilityId: string): Promise<Transportation[]> {
        return await this.repository.findWithFacilityByFacilityId(facilityId);
    }

    async getTransportation(name: string, facilityId: string): Promise<Transportation[] | null> {
        return await this.repository.findByTypeFacilityId(name, facilityId);
    }

    async getTransportationWithFacility(name: string, facilityId: string): Promise<Transportation[] | null> {
        return await this.repository.findWithFacilityByTypeFacilityId(name, facilityId);
    }

    async getTransportationWithTypeId(id: string): Promise<Transportation[] | null> {
        return await this.repository.findByTypeId(id);
    }

    async save(input: TransportationInput): Promise<Transportation> {
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
        let transportationResponse = await this.repository.findByTypeFacilityIdAddress(input.type, input.facility, input.address);
        if (transportationResponse && transportationResponse.length > 0) {
            throw new Error("Transportation already exists");
        }

        let type = await this.transportationTypeRepository.find(input.type);
        if (type) {
            let transportation = Transportation.withInput(input, type);
            let stringError = this.inputStringValidator.validate(transportation);
            if(stringError) {
                throw stringError;
            }
            
            if(!input.onsite) {
                let error = this.validator.validate(input.operationalHours!);
                if(error) {
                    throw error;
                }

                if(!input.address) {
                    throw new Error("Transportation address is missing.")
                }
            }
            return await this.repository.save(transportation);
        }
        throw new Error("TransportationType does not exist");
    }

    async update(id: string, input: TransportationInput): Promise<Transportation | null> {
        assert(id);
        assert(input);
        let facilityExists = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityExists) {
            throw new Error("Facility does not exist.");
        }
        let transportationResponse = await this.repository.findByTypeFacilityIdAddress(input.type, input.facility, input.address);
        if (transportationResponse && transportationResponse.length > 0 && transportationResponse[0]._id.toString() !== id) {
            throw new Error("Transportation already exists");
        }

        if(!input.onsite) {
            let error = this.validator.validate(input.operationalHours!);
            if(error) {
                throw error;
            }
            if(!input.address) {
                throw new Error("Transportation address is missing.")
            }
        }
         
        let type = await this.transportationTypeRepository.find(input.type);
        if (type) {
            let transportation = Transportation.withIdInput(id, input, type);
            let stringError = this.inputStringValidator.validate(transportation);
            if(stringError) {
                throw stringError;
            }
            let transportationResponse = await this.repository.update(id, transportation);
            if (transportationResponse) {
                return transportationResponse;
            }
            throw new Error(`Unable to update transportation ${id}. Transportation not found.`);
        }
        throw new Error("TransportationType does not exist");
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let transportation = await this.repository.delete(id);
        if (!transportation) {
            throw new Error(`Unable to delete transportation ${id}. Transportation not found.`);
        }
        return transportation;

    }
}