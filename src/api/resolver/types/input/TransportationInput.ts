import { MinLength, IsNotEmpty, ValidateNested, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
import { AddressInput } from "./AddressInput";
import { OperationalHoursInput } from "./OperationalHoursInput";
 
@InputType()
export class TransportationInput {

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    type!: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    facility!: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    desc!: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    url?: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    onsite!: boolean;

    @ValidateNested()
    @Field(type => AddressInput, { nullable: true })
    address!: AddressInput;

    @ValidateNested()
    @Field(type => [OperationalHoursInput], { nullable: true })
    operationalHours?: OperationalHoursInput[];
}