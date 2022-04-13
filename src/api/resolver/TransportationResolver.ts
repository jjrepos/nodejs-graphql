import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Fields } from "../middleware/decorator/Fields";
import { TransportationService } from "../service/TransportationService";
import { TransportationInput } from "./types/input/TransportationInput";
import { TransportationOutput } from "./types/output/TransportationOutput";

@Resolver(type => TransportationOutput)
export class TransportationResolver {
    private readonly service: TransportationService = new TransportationService();

    @Query(returns => [TransportationOutput], { nullable: false })
    async allTransportations(@Arg("facilityId", { nullable: false }) facilityId: string,
        @Fields() fields: String[]): Promise<TransportationOutput[]> {
        if (fields.includes("facility")) {
            let transportations = await this.service.getAllTransportationsWithFacility(facilityId);
            return transportations.map(transportation => { return TransportationOutput.withTransportation(transportation) });
        }
        let transportation = await this.service.getAllTransportations(facilityId);
        return transportation.map(trans => { return TransportationOutput.withTransportation(trans) });
    }

    @Query(returns => [TransportationOutput], { nullable: false })
    async transportation(@Arg("name", { nullable: false }) name: string,
        @Arg("facilityId", { nullable: false }) facilityId: string, @Fields() fields: String[]): Promise<TransportationOutput[] | null> {
        if (fields.includes("facility")) {
            let transportations = await this.service.getTransportationWithFacility(name, facilityId);
            if (transportations) {
                return transportations.map(transportation => { return TransportationOutput.withTransportation(transportation) });
            }
            return null;
        }
        let transportations = await this.service.getTransportation(name, facilityId);
        if (transportations) {
            return transportations.map(transportation => { return TransportationOutput.withTransportation(transportation) });
        }
        return null;
    }

    @Mutation(returns => TransportationOutput)
    async saveTransportation(@Arg("transportation", { nullable: false },) transportationInput: TransportationInput): Promise<TransportationOutput> {
        let transportation = await this.service.save(transportationInput);
        return TransportationOutput.withTransportation(transportation);
    }

    @Mutation(returns => TransportationOutput, { nullable: true })
    async updateTransportation(@Arg("id", { nullable: false },) id: string, @Arg("transportation", { nullable: false }) transportationInput: TransportationInput): Promise<TransportationOutput | null> {
        let transportation = await this.service.update(id, transportationInput);
        return transportation ? TransportationOutput.withTransportation(transportation) : null;
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteTransportation(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
}