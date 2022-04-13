import { Field, ID, ObjectType } from "type-graphql";
import { Address } from "../../../model/Address";
import { Facility } from "../../../model/Facility";
import { OperationalHours } from "../../../model/OperationalHours";
import { Transportation } from "../../../model/Transportation";

@ObjectType("Transportation")
export class TransportationOutput {
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

    @Field({ nullable: true })
    imageUrl?: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;

    static withTransportation(transportation: Transportation): TransportationOutput {
        let transportationOutput = new TransportationOutput();
        transportationOutput.id = transportation._id.toHexString();
        transportationOutput.type = transportation.type.name;
        if (transportation.facility) {
            transportationOutput.facility = <Facility>transportation.facility.valueOf();
        }
        transportationOutput.desc = transportation.desc;
        transportationOutput.email = transportation.email;
        transportationOutput.phone = transportation.phone;
        transportationOutput.url = transportation.url;
        transportationOutput.onsite = transportation.onsite;
        transportationOutput.address = transportation.address;
        transportationOutput.operationalHours = transportation.operationalHours;
        transportationOutput.imageUrl = transportation.imageUrl;
        transportationOutput.createdAt = transportation.createdAt;
        transportationOutput.updatedAt = transportation.updatedAt;
        return transportationOutput;
    }
}  