import { Field, ID, ObjectType } from "type-graphql";
import { Facility } from "../../../model/Facility";
import { Notification } from "../../../model/Notification";

@ObjectType("Notification")
export class NotificationOutput {

    
    @Field(type => ID)
    id: string;

    @Field({ nullable: false })
    title!: string;

    @Field(type => Facility, { nullable: true })
    facility?: Facility;

    @Field({ nullable: false })
    desc!: string;

    @Field( {nullable: false })
    startsOn!: Date; 


    @Field({ nullable: true })
    endsOn?: Date;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;

    @Field()
    isActive: boolean;

    static withOperation(notification: Notification): NotificationOutput {
        let notificationOutput = new NotificationOutput();
        notificationOutput.id = notification._id.toHexString();
        notificationOutput.title = notification.title;
        
        if (notification.facility) {
            notificationOutput.facility = <Facility>notification.facility.valueOf();
        }

        notificationOutput.desc = notification.desc;
        notificationOutput.startsOn =notification.startsOn;
        notificationOutput.endsOn = notification.endsOn;
        notificationOutput.createdAt = notification.createdAt;
        notificationOutput.updatedAt = notification.updatedAt;
        notificationOutput.isActive = notification.endsOn! ? (notification.endsOn! > new Date()) : true;
        return notificationOutput;
    }
}  