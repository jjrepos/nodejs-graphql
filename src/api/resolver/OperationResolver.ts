import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Fields } from "../middleware/decorator/Fields";
import { OperationService } from "../service/OperationService";
import { OperationInput } from "./types/input/OperationInput";
import { OperationOutput } from "./types/output/OperationOutput";

@Resolver(type => OperationOutput)
export class OperationResolver {
    private readonly service: OperationService = new OperationService();

    @Query(returns => [OperationOutput], { nullable: false })
    async allOperations(@Arg("facilityId", { nullable: false }) facilityId: string,
        @Fields() fields: String[]): Promise<OperationOutput[]> {
        if (fields.includes("facility")) {
            let operations = await this.service.getAllOperationsWithFacility(facilityId);
            return operations.map(operation => { return OperationOutput.withOperation(operation) });
        }
        let operation = await this.service.getAllOperations(facilityId);
        return operation.map(ops => { return OperationOutput.withOperation(ops) });
    }

    @Query(returns => [OperationOutput], { nullable: false })
    async operation(@Arg("name", { nullable: false }) name: string,
        @Arg("facilityId", { nullable: false }) facilityId: string, @Fields() fields: String[]): Promise<OperationOutput[] | null> {
        if (fields.includes("facility")) {
            let operations = await this.service.getOperationWithFacility(name, facilityId);
            if (operations) {
                return operations.map(operation => { return OperationOutput.withOperation(operation) });
            }
            return null;
        }
        let operations = await this.service.getOperation(name, facilityId);
        if (operations) {
            return operations.map(operation => { return OperationOutput.withOperation(operation) });
        }
        return null;
    }

    @Mutation(returns => OperationOutput)
    async saveOperation(@Arg("operation", { nullable: false },) operationInput: OperationInput): Promise<OperationOutput> {
        let operation = await this.service.save(operationInput);
        return OperationOutput.withOperation(operation);
    }

    @Mutation(returns => OperationOutput, { nullable: true })
    async updateOperation(@Arg("id", { nullable: false },) id: string, @Arg("operation", { nullable: false }) operationInput: OperationInput): Promise<OperationOutput | null> {
        let operation = await this.service.update(id, operationInput);
        return operation ? OperationOutput.withOperation(operation) : null;
    }

    @Mutation(returns => Boolean)
    async deleteOperation(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
}