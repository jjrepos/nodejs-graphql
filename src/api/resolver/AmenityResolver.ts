import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Fields } from "../middleware/decorator/Fields";
import { AmenityService } from "../service/AmenityService";
import { AmenityInput } from "./types/input/AmenityInput";
import { AmenityOutput } from "./types/output/AmenityOutput";

@Resolver(type => AmenityOutput)
export class AmenityResolver {
    private readonly service: AmenityService = new AmenityService();

    @Query(returns => [AmenityOutput], { nullable: false })
    async allAmenities(@Arg("facilityId", { nullable: false }) facilityId: string,
        @Fields() fields: String[]): Promise<AmenityOutput[]> {
        if (fields.includes("facility")) {
            let amenities = await this.service.getAllAmenitiesWithFacility(facilityId);
            return amenities.map(amenity => { return AmenityOutput.withAmenity(amenity) });
        }
        let amenities = await this.service.getAllAmenities(facilityId);
        return amenities.map(amenity => { return AmenityOutput.withAmenity(amenity) });
    }

    @Query(returns => [AmenityOutput], { nullable: false })
    async amenity(@Arg("name", { nullable: false }) name: string,
        @Arg("facilityId", { nullable: false }) facilityId: string, @Fields() fields: String[]): Promise<AmenityOutput[] | null> {
        if (fields.includes("facility")) {
            let amenities = await this.service.getAmenityWithFacility(name, facilityId);
            if (amenities) {
                return amenities.map(amenity => { return AmenityOutput.withAmenity(amenity) });
            }
            return null;
        }
        let amenities = await this.service.getAmenity(name, facilityId);
        if (amenities) {
            return amenities.map(amenity => { return AmenityOutput.withAmenity(amenity) });
        }
        return null;
    }

    @Mutation(returns => AmenityOutput)
    async saveAmenity(@Arg("amenity", { nullable: false },) amenityInput: AmenityInput): Promise<AmenityOutput> {
        let amenity = await this.service.save(amenityInput);
        return AmenityOutput.withAmenity(amenity);
    }

    @Mutation(returns => AmenityOutput, { nullable: true })
    async updateAmenity(@Arg("id", { nullable: false },) id: string, @Arg("amenity", { nullable: false }) amenityInput: AmenityInput): Promise<AmenityOutput | null> {
        let amenity = await this.service.update(id, amenityInput);
        return amenity ? AmenityOutput.withAmenity(amenity) : null;
    }

    @Mutation(returns => Boolean, { nullable: true })
    async deleteAmenity(@Arg("id", { nullable: false },) id: string): Promise<Boolean> {
        return await this.service.delete(id);
    }

}