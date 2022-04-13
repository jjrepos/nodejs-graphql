import { Field, ID, ObjectType } from "type-graphql";
import { Facility } from "../../../model/Facility";
import { Amenity } from "../../../model/Amenity";
import { OperationalHours } from "../../../model/OperationalHours";
import { Address } from "../../../model/Address";

@ObjectType("Amenity")
export class AmenityOutput {
    @Field(type => ID)
    id: string;

    @Field({ nullable: false })
    type!: string;

    @Field(type => Facility, { nullable: true })
    facility?: Facility;

    @Field({ nullable: false })
    desc: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    url?: string;

    @Field({ nullable: false })
    onsite: boolean;

    @Field(type => Address, { nullable: true })
    address?: Address;

    @Field(type => [OperationalHours], { nullable: true })
    operationalHours?: OperationalHours[];

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;

    static withAmenity(amenity: Amenity): AmenityOutput {
        let amenityOutput = new AmenityOutput();
        amenityOutput.id = amenity._id.toHexString();
        amenityOutput.type = amenity.type.name;
        if (amenity.facility) {
            amenityOutput.facility = <Facility>amenity.facility.valueOf();
        }
        amenityOutput.desc = amenity.desc;
        amenityOutput.email = amenity.email;
        amenityOutput.phone = amenity.phone;
        amenityOutput.url = amenity.url;
        amenityOutput.onsite = amenity.onsite;
        amenityOutput.address = amenity.address;
        amenityOutput.operationalHours = amenity.operationalHours;
        amenityOutput.createdAt = amenity.createdAt;
        amenityOutput.updatedAt = amenity.updatedAt;
        return amenityOutput;
    }
}