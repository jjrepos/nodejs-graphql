import { ArgsType, Field, Int } from "type-graphql";
import { Min, Max } from "class-validator";

@ArgsType()
export class PaginationArgs {
    @Field(type => Int, {defaultValue: 0})
    @Min(0)
    skip: number;

    @Field(type => Int, {defaultValue: 25})
    @Min(1)
    @Max(50)
    take: number;
}