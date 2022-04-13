import { SpaceType } from "../model/SpaceType";

export interface SpaceTypeRepository {
    find(name: string): Promise<SpaceType | null>;

    findAll(): Promise<SpaceType[]>;

    save(spaceType: SpaceType): Promise<SpaceType>;

    update(id: string, spaceType: SpaceType): Promise<SpaceType | null>;

    delete(id: string): Promise<Boolean>;
}