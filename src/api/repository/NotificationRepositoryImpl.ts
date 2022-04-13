import { assert } from "console";
import { Notification, NotificationModel } from "../model/Notification";
import { NotificationRepository } from "./NotificationRepository";
import { logging } from "../util/log/LogManager";


export class NotificationRepositoryImpl implements NotificationRepository {
    private logger = logging.getLogger(NotificationRepositoryImpl.name);

    async findById(id: string): Promise<Notification | null> {
        return await NotificationModel.findOne({ "_id": id}).exec();
    }

    async findByIdWithFacility(id: string): Promise<Notification | null> {
        return await NotificationModel.findOne({"_id": id}).populate("facility").exec();
    }

    async findAll(facilityId: string): Promise<Notification[]> {
        var st = process.hrtime();
        let result = await NotificationModel.find({ facility: facilityId }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken NotificationRepositoryImpl.findAll: " + elapsedSeconds);
        return result;
    }

    async findAllWithFacility(facilityId: string): Promise<Notification[]> {
        return await NotificationModel.find({ facility: facilityId })
            .populate("facility").exec();
        
    }

    async findActive(facilityId: string): Promise<Notification[]> {
        let now = new Date();
        return await NotificationModel.find({$or:[{ endsOn: {$type: "null" }},{endsOn: {$gt: now}}], facility: facilityId}).exec();
     }

    async findActiveWithFacility(facilityId: string): Promise<Notification[]> {
        let now = new Date();
        return await NotificationModel.find({$or:[{ endsOn: {$type: "null" }},{endsOn: {$gt: now}}], facility: facilityId})
            .populate("facility").exec(); 
    }
    

    async findInactive(facilityId: string): Promise<Notification[]> {
        let now = new Date();
        return await NotificationModel.find({endsOn: {$lt: now}, facility: facilityId}).exec();
    }

    async findInactiveWithFacility(facilityId: string): Promise<Notification[]> {
        let now = new Date();
        return await NotificationModel.find({endsOn: {$lt: now}, facility: facilityId})
            .populate("facility").exec();  
    }

    async save(notification: Notification): Promise<Notification> {
        assert(notification);
        return await NotificationModel.create(notification);
    }

    async update(id: string, notification: Notification): Promise<Notification | null> {
        assert(notification);
        /*return await NotificationModel.findByIdAndUpdate(id,  
            { $set:{desc: notification.desc, endsOn: notification.endsOn, startsOn: notification.startsOn,
            title: notification.title, updatedAt:notification.updatedAt }}, 
            { new: true }).exec();

          
*/
         return await NotificationModel.findByIdAndUpdate(id, notification,  { new: true, omitUndefined: true}).exec();

    }

    async delete(id: string): Promise<boolean> {
        assert(id);
        let response =  await NotificationModel.findByIdAndDelete({ _id: id }).exec();
        return response ? true : false;
    }

    async notificationExists(id: string): Promise<boolean> {
        return await NotificationModel.exists({_id: id});
    }

    async deleteNotificationForFacility(facilityId: string): Promise<any | null> {
        let filter = {facility: facilityId.toUpperCase()};
        let notResponse = await NotificationModel.exists(filter);
        if (notResponse) {
            return await NotificationModel.remove({facility: {$in: [facilityId.toUpperCase()]}})
        }
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}