import { Arg, Query, Mutation, Resolver } from "type-graphql";
import { Fields } from "../middleware/decorator/Fields";
import { SpaceService } from "../service/SpaceService";
import { SpaceInput } from "./types/input/SpaceInput";
import { SpaceOutput } from "./types/output/SpaceOutput";

@Resolver(type => SpaceOutput)
export class SpaceResolver {
    private readonly service: SpaceService = new SpaceService();

    @Query(returns => [SpaceOutput], { nullable: false })
    async allSpaces(@Arg("facilityId", { nullable: false }) facilityId: string,
        @Fields() fields: String[]): Promise<SpaceOutput[]> {
        if (fields.includes("facility")) {
            let spaces = await this.service.getAllSpacesWithFacility(facilityId);
            return spaces.map(space => { return SpaceOutput.withSpace(space) });
        }
        let spaces = await this.service.getAllSpaces(facilityId);
        return spaces.map(space => { return SpaceOutput.withSpace(space) });
    }

    @Query(returns => [SpaceOutput], { nullable: false })
    async space(@Arg("name", { nullable: false }) name: string,
        @Arg("facilityId", { nullable: false }) facilityId: string, @Fields() fields: String[]): Promise<SpaceOutput[] | null> {
        if (fields.includes("facility")) {
            let spaces = await this.service.getSpaceWithFacility(name, facilityId);
            if (spaces) {
                return spaces.map(space => { return SpaceOutput.withSpace(space) });
            }
            return null;
        }
        let spaces = await this.service.getSpace(name, facilityId);
        if (spaces) {
            return spaces.map(space => { return SpaceOutput.withSpace(space) });
        }
        return null;
    }

    @Mutation(returns => SpaceOutput)
    async saveSpace(@Arg("space", { nullable: false },) spaceInput: SpaceInput): Promise<SpaceOutput> {
        let space = await this.service.save(spaceInput);
        return SpaceOutput.withSpace(space);
    }

    @Mutation(returns => SpaceOutput, { nullable: true })
    async updateSpace(@Arg("id", { nullable: false },) id: string, @Arg("space", { nullable: false }) spaceInput: SpaceInput): Promise<SpaceOutput | null> {
        let space = await this.service.update(id, spaceInput);
        return space ? SpaceOutput.withSpace(space) : null;
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteSpace(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }

}