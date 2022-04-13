import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class StateCode {
    @Field(type => ID, { name: "id" })
    _id: ObjectId;

    @Property({ nullable: false, unique: true, uppercase: true })
    @Field()
    code!: string;

    @Field()
    @Property({ nullable: false })
    name!: string;
}

export const StateCodeModel = getModelForClass(StateCode); 