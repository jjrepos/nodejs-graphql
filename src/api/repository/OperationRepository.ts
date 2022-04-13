import { Operation } from "../model/Operation";
import { OperationType } from "../model/OperationType";

export interface OperationRepository {
    findByFacilityId(facilityCode: string): Promise<Operation[]>;

    findWithFacilityByFacilityId(facilityId: string): Promise<Operation[]>;

    findByOperationTypeFacilityId(type: string, facilityCode: string): Promise<Operation[] | null>;

    operationExists(name: string, desc: string, facilityId: string): Promise<boolean>;

    findWithFacilityByOperationTypeFacilityId(type: string, facilityId: string): Promise<Operation[] | null>;

    findByTypeId(id: string): Promise<Operation[] | null>;

    findWithFacilityByFacilityId(facilityId: string): Promise<Operation[] | null>

    deleteOperationForFacility(facilityId: string): Promise<any | null>

    save(operation: Operation): Promise<Operation>;

    update(id: string, operation: Operation): Promise<Operation | null>;

    updateType(id: string, operationType: OperationType): Promise<any | null>;

    delete(id: string): Promise<boolean>;

    existsByTypeId(id: string): Promise<boolean>;
}