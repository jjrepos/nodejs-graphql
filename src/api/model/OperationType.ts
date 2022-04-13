import { getModelForClass, modelOptions, mongoose, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { OperationTypeInput } from "../resolver/types/input/OperationTypeInput";

@ObjectType()
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class OperationType {
    @Field(type => ID, { name: "id" })
    _id: ObjectId;

    @Field()
    @Property({ nullable: false, unique: true, uppercase: true })
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

    static withIdInput(id: string, input: OperationTypeInput): OperationType {
        let operationType = this.withInput(input);
        try {
            operationType._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return operationType;
    }

    static withInput(input: OperationTypeInput): OperationType {
        let operationType = new OperationType();
        operationType.name = input.name;
        operationType.desc = input.desc;
        return operationType;
    }
}

export const OperationTypeModel = getModelForClass(OperationType); 