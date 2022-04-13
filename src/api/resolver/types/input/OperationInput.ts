import { MinLength, IsNotEmpty, ValidateNested, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
import { OperationalHoursInput } from "./OperationalHoursInput";
 
@InputType()
export class OperationInput {

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    type!: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    facility!: string;


    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    desc!: string;

    //@MinLength(4)
    @Field({ nullable: true })
    poc?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    url?: string;

    @ValidateNested()
    @Field(type => [OperationalHoursInput], { nullable: true })
    operationalHours?: OperationalHoursInput[];


    //@MinLength(3)
    @Field({ nullable: true })
    room?: string;

}