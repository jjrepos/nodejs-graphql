import { assert } from "console";
import { TransportationType } from "../model/TransportationType";
import { TransportationRepository } from "../repository/TransportationRepository";
import { TransportationRepositoryImpl } from "../repository/TransportationRepositoryImpl";
import { TransportationTypeRepository } from "../repository/TransportationTypeRepository";
import { TransportationTypeRepositoryImpl } from "../repository/TransportationTypeRepositoryImpl";
import { Transaction } from "../repository/util/Transaction";
import { TransportationTypeInput } from "../resolver/types/input/TransportationTypeInput";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";



export class TransportationTypeService {
    private readonly transportationRepository: TransportationRepository = new TransportationRepositoryImpl();
    private readonly repository: TransportationTypeRepository = new TransportationTypeRepositoryImpl();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getTransportationType(name: string): Promise<TransportationType | null> {
        return await this.repository.find(name);
    }

    async getAllTransportationTypes(): Promise<TransportationType[]> {
        return await this.repository.findAll();
    }

    async save(input: TransportationTypeInput): Promise<TransportationType> {
        assert(input);
        let type = await this.getTransportationType(input.name);
        if (type) {
            throw new Error("Transportation type already exists");
        }
        let transportationType = TransportationType.withInput(input);
        let stringError = this.inputStringValidator.validate(transportationType);
        if(stringError) {
            throw stringError;
        }
        return await this.repository.save(transportationType);
    }

    @Transaction
    async update(id: string, input: TransportationTypeInput): Promise<TransportationType | null> {
        assert(id);
        assert(input);
        let transportationType = TransportationType.withIdInput(id, input);
        let stringError = this.inputStringValidator.validate(transportationType);
        if(stringError) {
            throw stringError;
        }
        let type = await this.repository.update(id, transportationType);
        if (!type) {
            throw new Error(`Unable to update transportation type ${id}. Transportation type not found.`);
        }
        await this.transportationRepository.updateType(id, type);
        return type;
    }

    async delete(id: string): Promise<Boolean> {
        assert(id);
        let transportationExists = await this.transportationRepository.existsByTypeId(id);
        if (transportationExists) {
            throw new Error("Cannot delete type - has associated transportations");
        }
        let type = await this.repository.delete(id);
        if (!type) {
            throw new Error(`Unable to delete transportation type ${id}. Transportation type not found.`);
        }
        return type;
    }
}