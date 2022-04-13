import { Amenity } from "../model/Amenity";
import { AmenityType } from "../model/AmenityType";
import { Address } from "../model/Address";

export interface AmenityRepository {
    findByFacilityId(facilityId: string): Promise<Amenity[]>;

    findWithFacilityByFacilityId(facilityId: string): Promise<Amenity[]>;

    findByTypeFacilityId(type: string, facilityId: string): Promise<Amenity[] | null>;

    findWithFacilityByTypeFacilityId(type: string, facilityId: string): Promise<Amenity[] | null>;

    findByTypeDescFacilityId(name: string, desc: string, facilityId: string): Promise<Amenity[] | null>;

    findByTypeFacilityIdAddress(name: string, facilityId: string, address: Address): Promise<Amenity[] | null>;

    deleteAmenityForFacility(facilityId: string): Promise<any | null>;

    save(amenity: Amenity): Promise<Amenity>;

    update(id: string, amenity: Amenity): Promise<Amenity | null>;

    updateType(id: string, amenityType: AmenityType): Promise<any | null>;

    delete(id: string): Promise<Boolean>;

    existsByTypeId(id: string): Promise<boolean>;
}