import { getModelForClass, modelOptions, mongoose, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { SpaceTypeInput } from "../resolver/types/input/SpaceTypeInput";

@ObjectType()
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class SpaceType {
    @Field(type => ID, { name: "id" })
    _id: ObjectId;

    @Property({ nullable: false, unique: true, uppercase: true })
    @Field()
    name!: string;

    @Field()
    @Property({ nullable: false })
    desc!: string;

    @Field()
    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Field()
    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withIdInput(id: string, input: SpaceTypeInput): SpaceType {
        let spaceType = this.withInput(input);
        try {
            spaceType._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return spaceType;
    }

    static withInput(input: SpaceTypeInput): SpaceType {
        let spaceType = new SpaceType();
        spaceType.name = input.name;
        spaceType.desc = input.desc;
        return spaceType;
    }
}

export const SpaceTypeModel = getModelForClass(SpaceType); 