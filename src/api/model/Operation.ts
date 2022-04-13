import { getModelForClass, mongoose, prop as Property, Ref, modelOptions } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Facility } from "./Facility";
import { OperationalHours } from "./OperationalHours";
import { OperationType } from "./OperationType";
import { OperationInput } from "../resolver/types/input/OperationInput";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})

export class Operation {
    _id: ObjectId;

    @Property({ required: true, nullable: false })
    type!: OperationType;

    @Property({ required: true, ref: Facility, nullable: false, type: mongoose.Schema.Types.String, uppercase: true })
    facility?: Ref<Facility>;


    @Property({ nullable: false })
    desc!: string;

    @Property({ nullable: true })
    poc?: string;

    @Property({ nullable: true })
    email?: string;

    // may be make it array
    @Property({ nullable: true, Kind: Array, type: mongoose.Schema.Types.String })
    phone?: string;

    @Property({ nullable: true })
    url?: string;

    @Property({ nullable: true})
    room?: string;

    @Property({ nullable: true, required: false, _id: false, Kind: Array, type: OperationalHours })
    operationalHours?: OperationalHours[];

    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withIdInput(id: string, input: OperationInput, type?: OperationType): Operation {
        let operation = Operation.withInput(input, type);
        try {
            operation._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return operation;
    }

    static withInput(input: OperationInput, type?: OperationType): Operation {
        let operation = new Operation();
        if (type) {
            operation.type = type;
        }
        operation.facility = input.facility;
        operation.desc = input.desc;
        operation.poc = input.poc;
        operation.email = input.email;
        operation.phone = input.phone;
        operation.room = input.room;
        operation.url = input.url;
        if (input.operationalHours) {
            operation.operationalHours = input.operationalHours.map((operationalHour) => { return OperationalHours.withInput(operationalHour) });
        }
        return operation;
    }
}

export const OperationModel = getModelForClass(Operation);   