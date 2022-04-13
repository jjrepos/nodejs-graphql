import { AmenityType } from "../model/AmenityType";

export interface AmenityTypeRepository {

    find(name: string): Promise<AmenityType | null>;

    findAll(): Promise<AmenityType[]>;

    save(amenityType: AmenityType): Promise<AmenityType>;

    update(id: string, amenityType: AmenityType): Promise<AmenityType | null>;

    delete(id: string): Promise<Boolean>;
}