import { assert } from "console";
import { Operation } from "../model/Operation";
import { OperationRepository } from "../repository/OperationRepository";
import { OperationRepositoryImpl } from "../repository/OperationRepositoryImpl";
import { OperationTypeRepository } from "../repository/OperationTypeRepository";
import { OperationTypeRepositoryImpl } from "../repository/OperationTypeRepositoryImpl";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";
import { OperationInput } from "../resolver/types/input/OperationInput";
import { OperationalHoursValidator } from "../repository/util/validator/OperationalHoursValidator";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";


export class OperationService {
    private readonly repository: OperationRepository = new OperationRepositoryImpl();
    private readonly operationTypeRepository: OperationTypeRepository = new OperationTypeRepositoryImpl();
    private readonly facilityRepository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly validator: OperationalHoursValidator = new OperationalHoursValidator();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getAllOperations(facilityId: string): Promise<Operation[]> {
        return await this.repository.findByFacilityId(facilityId);
    }

    async getAllOperationsWithFacility(facilityId: string): Promise<Operation[]> {
        return await this.repository.findWithFacilityByFacilityId(facilityId);
    }

    async getOperation(name: string, facilityId: string): Promise<Operation[] | null> {
        return await this.repository.findByOperationTypeFacilityId(name, facilityId);
    }

    async getOperationWithFacility(name: string, facilityId: string): Promise<Operation[] | null> {
        return await this.repository.findWithFacilityByOperationTypeFacilityId(name, facilityId);
    }

    async getOperationWithTypeId(id: string): Promise<Operation[] | null> {
        return await this.repository.findByTypeId(id);
    }

    async save(input: OperationInput): Promise<Operation> {
        assert(input);
        let facilityResponse = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityResponse) {
            throw new Error("Facility " + input.facility + " does not exist");
        }

        let operationExists = await this.repository.operationExists(input.type, input.desc, input.facility);
        if (operationExists) {
            throw new Error("Operation already exists for operation type, operation description and facility");
        }

        
        let type = await this.operationTypeRepository.find(input.type);
        if (type) {
            let operation = Operation.withInput(input, type);
            let stringError = this.inputStringValidator.validate(operation);
            if (stringError) {
                throw stringError;
            }

            if (operation.operationalHours) {
                let error = this.validator.validate(operation.operationalHours!);
                if (error) {
                    throw error;
                }
            }
            return await this.repository.save(operation);
        }
        throw new Error("Operation Type does not exist");
    }

    async update(id: string, input: OperationInput): Promise<Operation | null> {
        assert(id);
        assert(input);
        let facilityResponse = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityResponse) {
            throw new Error("Facility " + input.facility + " does not exist");
        }

        if (input.operationalHours) {
            let error = this.validator.validate(input.operationalHours!);
            if (error) {
                throw error;
            }
        }
        let type = await this.operationTypeRepository.find(input.type);
        if (type) {
            let operation = Operation.withIdInput(id, input, type);
            let stringError = this.inputStringValidator.validate(operation);
            if (stringError) {
                throw stringError;
            }
            let operationResponse = await this.repository.update(id, operation);
            if (operationResponse) {
                return operationResponse;
            }
            throw new Error("Unable to update operation. Operation not found.");
        }
        throw new Error("OperationType does not exist");
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let operation = await this.repository.delete(id);
        if (operation) {
            return Boolean(true);
        } else {
           throw new Error("Unable to delete operation. Operation not found.");
        }
    }
}