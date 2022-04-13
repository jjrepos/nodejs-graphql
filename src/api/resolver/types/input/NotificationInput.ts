import { MinLength, IsNotEmpty, IsDefined} from "class-validator"; 
import { Field, InputType } from "type-graphql";
 
@InputType()
export class NotificationInput {

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    title: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    facility: string;

    @MinLength(3)
    @IsDefined()
    @Field({ nullable: true })
    desc!: string;

    @IsNotEmpty()
    @IsDefined()
    @Field( { nullable: true })
    startsOn!: string;

    @Field( { nullable: true })
    endsOn?: string;

}