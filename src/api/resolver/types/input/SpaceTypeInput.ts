import { IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class SpaceTypeInput {
    @IsNotEmpty()
    @IsDefined()
    @Field({nullable: true})
    name!: string;

    @IsNotEmpty()
    @IsDefined()
    @Field({nullable: true})
    desc!: string;
}