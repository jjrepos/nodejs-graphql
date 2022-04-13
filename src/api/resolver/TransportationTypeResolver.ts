import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { TransportationType } from "../model/TransportationType";
import { TransportationTypeService } from "../service/TransportationTypeService";
import { TransportationTypeInput } from "./types/input/TransportationTypeInput";

@Resolver(type => TransportationType)
export class TransportationTypeResolver {
    private readonly service: TransportationTypeService = new TransportationTypeService();

    @Query(returns => [TransportationType], { nullable: false })
    async allTransportationsTypes(): Promise<TransportationType[]> {
        return await this.service.getAllTransportationTypes();
    }

    @Query(returns => TransportationType, { nullable: true })
    async transportationType(@Arg("name", { nullable: false }) name: string): Promise<TransportationType | null> {
        return await this.service.getTransportationType(name);
    }

    @Mutation(returns => TransportationType)
    async saveTransportationType(@Arg("transportationType", { nullable: false },) transportationTypeInput: TransportationTypeInput): Promise<TransportationType> {
        return await this.service.save(transportationTypeInput);
    }

    @Mutation(returns => TransportationType, { nullable: true })
    async updateTransportationType(@Arg("id", { nullable: false },) id: string, @Arg("transportationType", { nullable: false }) transportationTypeInput: TransportationTypeInput): Promise<TransportationType | null> {
        return await this.service.update(id, transportationTypeInput);
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteTransportationType(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
}