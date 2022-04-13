import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { OperationalHoursInput } from "../resolver/types/input/OperationalHoursInput";

@ObjectType()
export class OperationalHours {
    @Field(type => Day)
    @Property({ enum: () => Day, required: false })
    day: Day;

    @Field()
    @Property({ required: false })
    openTime: string;

    @Field()
    @Property({ required: false })
    closeTime: String;

    static withInput(input: OperationalHoursInput): OperationalHours {
        let operationalHour = new OperationalHours();
        operationalHour.day = input.day;
        operationalHour.openTime = input.openTime;
        operationalHour.closeTime = input.closeTime;
        return operationalHour;
    }
}

export enum Day {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday"
}

registerEnumType(Day, {
    name: "DaysOfOperation",
    description: "Days of the week",
});