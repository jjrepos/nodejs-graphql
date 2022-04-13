import { getModelForClass, modelOptions, mongoose, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { AmenityTypeInput } from "../resolver/types/input/AmenityTypeInput";

@ObjectType()
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class AmenityType {
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

    static withIdInput(id: string, input: AmenityTypeInput): AmenityType {
        let transportationType = this.withInput(input);
        try {
            transportationType._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return transportationType;
    }

    static withInput(input: AmenityTypeInput): AmenityType {
        let transportationType = new AmenityType();
        transportationType.name = input.name;
        transportationType.desc = input.desc;
        return transportationType;
    }
}

export const AmenityTypeModel = getModelForClass(AmenityType); 