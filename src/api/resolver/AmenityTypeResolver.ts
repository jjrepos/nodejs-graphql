import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { AmenityType } from "../model/AmenityType";
import { AmenityTypeService } from "../service/AmenityTypeService";
import { AmenityTypeInput } from "../resolver/types/input/AmenityTypeInput";

@Resolver(type => AmenityType)
export class AmenityTypeResolver {
    private readonly service: AmenityTypeService = new AmenityTypeService();

    @Query(returns => [AmenityType], { nullable: false })
    async allAmenityTypes(): Promise<AmenityType[]> {
        return await this.service.getAllAmenityTypes();
    }

    @Query(returns => AmenityType, { nullable: true })
    async amenityType(@Arg("name", { nullable: false }) name: string): Promise<AmenityType | null> {
        return await this.service.getAmenityType(name);
    }

    @Mutation(returns => AmenityType)
    async saveAmenityType(@Arg("amenityType", { nullable: false },) amenityTypeInput: AmenityTypeInput): Promise<AmenityType> {
        return await this.service.save(amenityTypeInput);
    }

    @Mutation(returns => AmenityType, { nullable: true })
    async updateAmenityType(@Arg("id", { nullable: false },) id: string, @Arg("amenityType", { nullable: false }) amenityTypeInput: AmenityTypeInput): Promise<AmenityType | null> {
        return await this.service.update(id, amenityTypeInput);
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteAmenityType(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }
}