import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { AddressInput } from "../resolver/types/input/AddressInput";

@ObjectType()
export class Address {
    @Field()
    @Property({ required: true })
    street1!: string;

    @Field({ nullable: true })
    @Property()
    street2?: string;

    @Field()
    @Property({ required: true })
    city!: string;

    @Field({ nullable: true })
    @Property()
    zipCode?: string;

    @Field({ nullable: true })
    @Property()
    stateCode?: string;

    @Field({ nullable: true })
    @Property()
    state?: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    countryCode: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    country?: string;

    static withInput(input: AddressInput): Address {
        let address = new Address();
        address.street1 = input.street1;
        address.street2 = input.street2;
        address.city = input.city;
        address.zipCode = input.zipCode;
        address.stateCode = input.stateCode;
        address.countryCode = input.countryCode;
        return address;
    }
}