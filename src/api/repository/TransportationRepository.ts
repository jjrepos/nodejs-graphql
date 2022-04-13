import { Address } from "../model/Address";
import { Transportation } from "../model/Transportation";
import { TransportationType } from "../model/TransportationType";

export interface TransportationRepository {
    findByFacilityId(facilityCode: string): Promise<Transportation[]>;

    findWithFacilityByFacilityId(facilityId: string): Promise<Transportation[]>;

    findByTypeFacilityId(type: string, facilityCode: string): Promise<Transportation[] | null>;

    findWithFacilityByTypeFacilityId(type: string, facilityId: string): Promise<Transportation[] | null>;

    findByTypeFacilityIdAddress(name: string, facilityId: string, address: Address): Promise<Transportation[] | null>

    findByTypeId(id: string): Promise<Transportation[] | null>;

    deleteTransportaionForFacility(facilityId: string): Promise<any | null>

    save(transportation: Transportation): Promise<Transportation>;

    update(id: string, transportation: Transportation): Promise<Transportation | null>;

    updateType(id: string, transportationType: TransportationType): Promise<any | null>;

    delete(id: string): Promise<Boolean>;

    existsByTypeId(id: string): Promise<boolean>;
}