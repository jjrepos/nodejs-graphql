import { assert } from "console";
import { OperationType } from "../model/OperationType";
import { OperationRepository } from "../repository/OperationRepository";
import { OperationRepositoryImpl } from "../repository/OperationRepositoryImpl";
import { OperationTypeRepository } from "../repository/OperationTypeRepository";
import { OperationTypeRepositoryImpl } from "../repository/OperationTypeRepositoryImpl";
import { Transaction } from "../repository/util/Transaction";
import { OperationTypeInput } from "../resolver/types/input/OperationTypeInput";
import { logging } from "../util/log/LogManager";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";



export class OperationTypeService {
    private logger = logging.getLogger(OperationTypeService.name);

    private readonly operationRepository: OperationRepository = new OperationRepositoryImpl();
    private readonly repository: OperationTypeRepository = new OperationTypeRepositoryImpl();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getOperationType(name: string): Promise<OperationType | null> {
        return await this.repository.find(name);
    }

    async getAllOperationTypes(): Promise<OperationType[]> {
        return await this.repository.findAll();
    }

    async save(input: OperationTypeInput): Promise<OperationType> {
        assert(input);
        let type = await this.getOperationType(input.name);
        if (type) {
            throw new Error("Operation type already exists");
        }
        let operationType = OperationType.withInput(input);
        let stringError = this.inputStringValidator.validate(operationType);
        if (stringError) {
            throw stringError;
        }
        return await this.repository.save(operationType);
    }

    @Transaction
    async update(id: string, input: OperationTypeInput): Promise<OperationType | null> {
        assert(id);
        assert(input);
        let operationType = OperationType.withIdInput(id, input);
        let type = await this.repository.update(id, operationType);
        this.logger.debug("Type is: " + type);
        if (!type) {
            throw new Error(`Unable to update operation type ${id}. Operation type not found.`);
        }
        let stringError = this.inputStringValidator.validate(operationType);
        if (stringError) {
            throw stringError;
        }
        await this.operationRepository.updateType(id, type);
        return type;
    }

    async delete(id: string): Promise<boolean> {
        assert(id);
        let operationExists = await this.operationRepository.existsByTypeId(id);
        if (operationExists) {
            throw new Error("Cannot delete operation type - has associated operations");
        }
        let type = await this.repository.delete(id);

        if (type) {
            return Boolean(true);
        } else {
            throw new Error(`Unable to delete operation type ${id}. Operation type not found.`);
        }
    }
}