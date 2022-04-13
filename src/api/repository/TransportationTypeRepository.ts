import { TransportationType } from "../model/TransportationType";

export interface TransportationTypeRepository {

    find(name: string): Promise<TransportationType | null>;

    findAll(): Promise<TransportationType[]>;

    save(transportationType: TransportationType): Promise<TransportationType>;

    update(id: string, transportationType: TransportationType): Promise<TransportationType | null>;

    delete(id: string): Promise<Boolean>;
}