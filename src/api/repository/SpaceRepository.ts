import { Space } from "../model/Space";
import { SpaceType } from "../model/SpaceType";

export interface SpaceRepository {
    findByFacilityId(facilityCode: string): Promise<Space[]>;

    findWithFacilityByFacilityId(facilityId: string): Promise<Space[]>;

    findByTypeFacilityId(type: string, facilityCode: string): Promise<Space[] | null>;

    findWithFacilityByTypeFacilityId(type: string, facilityId: string): Promise<Space[] | null>;
    spaceExists(name: string, desc: string, facilityId: string): Promise<boolean> ;

    save(space: Space): Promise<Space>;

    update(id: string, space: Space): Promise<Space | null>;

    updateType(id: string, spaceType: SpaceType): Promise<any | null>;

    delete(id: string): Promise<Boolean>;

    existsByTypeFacilityId(name: string, facilityId: string): Promise<boolean>;

    existsByTypeId(id: string): Promise<boolean>;

    deleteSpaceForFacility(facilityId: string): Promise<any | null>;
}