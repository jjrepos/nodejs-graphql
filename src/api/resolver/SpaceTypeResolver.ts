import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { SpaceType } from "../model/SpaceType";
import { SpaceTypeService } from "../service/SpaceTypeService";
import { SpaceTypeInput } from "./types/input/SpaceTypeInput";

@Resolver(type => SpaceType)
export class SpaceTypeResolver {
    private readonly service: SpaceTypeService = new SpaceTypeService();

    @Query(returns => [SpaceType], { nullable: false })
    async allSpaceTypes(): Promise<SpaceType[]> {
        return await this.service.getAllSpaceTypes();
    }

    @Query(returns => SpaceType, { nullable: true })
    async spaceType(@Arg("name", { nullable: false }) name: string): Promise<SpaceType | null> {
        return await this.service.getSpaceType(name);
    }

    @Mutation(returns => SpaceType)
    async saveSpaceType(@Arg("spaceType", { nullable: false },) spaceTypeInput: SpaceTypeInput): Promise<SpaceType> {
        return await this.service.save(spaceTypeInput);
    }

    @Mutation(returns => SpaceType, { nullable: true })
    async updateSpaceType(@Arg("id", { nullable: false },) id: string, @Arg("spaceType", { nullable: false }) spaceTypeInput: SpaceTypeInput): Promise<SpaceType | null> {
        return await this.service.update(id, spaceTypeInput);
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteSpaceType(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
}