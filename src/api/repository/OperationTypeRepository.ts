import { OperationType } from "../model/OperationType";

export interface OperationTypeRepository {

    find(name: string): Promise<OperationType | null>;

    findAll(): Promise<OperationType[]>;

    save(operationType: OperationType): Promise<OperationType>;

    update(id: string, operationType: OperationType): Promise<OperationType | null>;

    delete(id: string): Promise<boolean>;
}