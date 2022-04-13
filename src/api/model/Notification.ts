import { getModelForClass, modelOptions, mongoose, prop as Property, Ref } from "@typegoose/typegoose";
import { Facility } from "./Facility";
import { ObjectId } from "mongodb";
import { Field, registerEnumType } from "type-graphql";
import { NotificationInput } from "../resolver/types/input/NotificationInput";

import { DateValidator } from "../repository/util/validator/DateValidator";


@modelOptions({
    schemaOptions: {
        //timestamps: true
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
})

export class Notification {
    _id: ObjectId;

    @Field()
    @Property({ nullable: false, required: true })
    title!: string;


    @Property({ nullable: false, required: true  })
    desc!: string;

    @Property({ required: true, ref: Facility, nullable: false, type: mongoose.Schema.Types.String, uppercase: true })
    facility: Ref<Facility>;

    @Property({ nullable: false, required: true, type: mongoose.Schema.Types.Date })
    startsOn!: Date;

    @Property({ nullable: true, required: false, type: mongoose.Schema.Types.Date  })
    endsOn?: Date;

    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;
   

    static withIdInput(id: string, input: NotificationInput): Notification {
        let notification = this.withInput(input);
        try {
            notification._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return notification;
    }

    static withInput(input: NotificationInput): Notification {
        let notification = new Notification();
        notification.title = input.title;
        notification.desc = input.desc;
        notification.facility = input.facility;

        try {
            notification.startsOn =  Notification.checkDate(input.startsOn, "startsOn" );
            if (input.endsOn != null && input.endsOn !== undefined)
                notification.endsOn =  Notification.checkDate(input.endsOn, "endsOn" );
            else  {
                notification.endsOn = null;
            } 
        } catch (ex) {
            throw new Error(ex);
        }
        return notification;
    }

    private static checkDate(inptDateString: string, name: string) : Date {
        let convertedDate = new DateValidator().validate(inptDateString);
        if (convertedDate instanceof Date) {
            if (convertedDate.toString() == "Invalid Date") {
                throw new Error(`${name} should be in format YYYY-MM-ddT00:00:00Z`);
            }
            return convertedDate;
        } else if (convertedDate instanceof Error) {
            throw new Error(`${name} ${convertedDate.message}`);
        }
    }
}

export const NotificationModel = getModelForClass(Notification); 

export enum NotificationStatus {
    ALL = "ALL",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

registerEnumType(NotificationStatus, {
    name: "NotificationStatus",
    description: "Notification Status",
});

