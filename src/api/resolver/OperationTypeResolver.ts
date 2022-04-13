import { Arg, Query, Mutation, Resolver } from "type-graphql";
import { OperationType } from "../model/OperationType";
import { OperationTypeService } from "../service/OperationTypeService";
import { OperationTypeInput } from "./types/input/OperationTypeInput";

@Resolver(of => OperationType)
export class OperationTypeResolver {
    private readonly service: OperationTypeService = new OperationTypeService();
    
    @Query(returns => [OperationType], { nullable: false })
    async allOperationsTypes(): Promise<OperationType[]> {
        return await this.service.getAllOperationTypes();
    }

    
    @Query(returns => OperationType, { nullable: true })
    async operationType(@Arg("name", { nullable: false }) name: string): Promise<OperationType | null> {
        return await this.service.getOperationType(name);
    }

    
    @Mutation(returns => OperationType)
    async saveOperationType(@Arg("operationType", { nullable: false },) operationTypeInput: OperationTypeInput): Promise<OperationType> {
        return await this.service.save(operationTypeInput);
    }

    @Mutation(returns => OperationType, { nullable: true })
    async updateOperationType(@Arg("id", { nullable: false },) id: string, @Arg("operationType", { nullable: false }) operationTypeInput: OperationTypeInput): Promise<OperationType | null> {
        return await this.service.update(id, operationTypeInput);
    }

    @Mutation(returns => Boolean)
    async deleteOperationType(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
    
}