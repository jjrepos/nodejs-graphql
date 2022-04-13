import { getModelForClass, modelOptions, mongoose, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { TransportationTypeInput } from "../resolver/types/input/TransportationTypeInput";

@ObjectType()
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class TransportationType {
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

    static withIdInput(id: string, input: TransportationTypeInput): TransportationType {
        let transportationType = this.withInput(input);
        try {
            transportationType._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return transportationType;
    }

    static withInput(input: TransportationTypeInput): TransportationType {
        let transportationType = new TransportationType();
        transportationType.name = input.name;
        transportationType.desc = input.desc;
        return transportationType;
    }
}

export const TransportationTypeModel = getModelForClass(TransportationType); 