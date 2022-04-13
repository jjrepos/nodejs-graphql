import { IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Day } from "../../../model/OperationalHours"

@InputType()
export class OperationalHoursInput {
    @IsNotEmpty()
    @IsDefined()
    @Field(type => Day, {nullable: true})
    day!: Day;

    @IsNotEmpty()
    @IsDefined()
    @Field({nullable: true})
    openTime!: string;

    @IsNotEmpty()
    @IsDefined()
    @Field({nullable: true})
    closeTime!: String;
}