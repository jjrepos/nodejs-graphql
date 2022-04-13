import { MinLength, IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
 
@InputType()
export class SpaceInput {

    @IsNotEmpty()
    @IsDefined()
    @Field({nullable: true})
    type!: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({nullable: true})
    facility!: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({nullable: true})
    desc!: string;
}