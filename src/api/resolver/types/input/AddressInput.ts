import { IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class AddressInput {
    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    street1: string;

    @Field({ nullable: true })
    street2?: string;

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    city: string;

    @Field({ nullable: true })
    zipCode?: string;

    @Field({ nullable: true })
    stateCode?: string;

    //@IsISO31661Alpha3()
    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    countryCode: string;
}