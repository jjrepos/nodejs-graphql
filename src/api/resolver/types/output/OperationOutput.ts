import { Field, ID, ObjectType } from "type-graphql";
import { Facility } from "../../../model/Facility";
import { OperationalHours } from "../../../model/OperationalHours";
import { Operation } from "../../../model/Operation";

@ObjectType("Operation")
export class OperationOutput {
    @Field(type => ID)
    id: string;

    @Field({ nullable: false })
    type!: string;

    @Field(type => Facility, { nullable: true })
    facility?: Facility;

    @Field({ nullable: false })
    desc: string;

    @Field({ nullable: true })
    poc?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    url?: string;

    @Field(type => [OperationalHours], { nullable: true })
    operationalHours?: OperationalHours[];

    @Field({ nullable: true })
    room?: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;

    static withOperation(operation: Operation): OperationOutput {
        let operationOutput = new OperationOutput();
        operationOutput.id = operation._id.toHexString();
        operationOutput.type = operation.type.name;

        if (operation.facility) {
            operationOutput.facility = <Facility>operation.facility.valueOf();
        }

        operationOutput.desc = operation.desc;
        operationOutput.poc = operation.poc;
        operationOutput.email = operation.email;
        operationOutput.phone = operation.phone;
        operationOutput.room = operation.room;
        operationOutput.url = operation.url;

        operationOutput.operationalHours = operation.operationalHours;
        operationOutput.createdAt = operation.createdAt;
        operationOutput.updatedAt = operation.updatedAt;
        return operationOutput;
    }
}  