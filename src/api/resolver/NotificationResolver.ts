import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Fields } from "../middleware/decorator/Fields";
import { NotificationService } from "../service/NotificationService";
import { NotificationInput } from "./types/input/NotificationInput";
import { NotificationOutput } from "./types/output/NotificationOutput";
import { NotificationStatus } from "../model/Notification";

@Resolver(of => NotificationOutput)
export class NotificationResolver {
    private readonly notificationService: NotificationService = new NotificationService();

    @Query(returns => NotificationOutput, { nullable: true })
    async notification(@Arg("id", { nullable: false }) id: string,
        @Fields() fields: String[]): Promise<NotificationOutput | null> {

    if (fields.includes("facility")) {
        let notification = await this.notificationService.getNotificationWithFacility(id);
        if (notification) {
            return NotificationOutput.withOperation(notification);
        }
        return null;
    } 
    let notification = await this.notificationService.getNotification(id);
    if (notification) {
        return NotificationOutput.withOperation(notification);
    }
    return null;
    }


    @Query(returns => [NotificationOutput])
    async allNotifications(@Arg("facilityId", { nullable: false }) facilityId: string,
            @Arg("notificationStatus", { nullable: false }) notificationStatus:  NotificationStatus,
            @Fields() fields: any[]): Promise<NotificationOutput[]> {
                
        if (fields.includes("facility")) {
            let nots = await this.notificationService.getAllNotificationsWithFacility(facilityId, notificationStatus);
            return nots.map(not => { return NotificationOutput.withOperation(not) });
        }

        let nots = await this.notificationService.getAllNotifications(facilityId, notificationStatus);
        return nots.map(not => { return NotificationOutput.withOperation(not) });
    }

    @Mutation(returns => NotificationOutput)
    async saveNotification(@Arg("input") notificationInput: NotificationInput): Promise<NotificationOutput> {
        let notification = await this.notificationService.save(notificationInput);
        return NotificationOutput.withOperation(notification);
    }

    @Mutation(returns => NotificationOutput)
    async updateNotification(@Arg("id") id: string, @Arg("input") notificationInput: NotificationInput): Promise<NotificationOutput | null> {
        let notification = await this.notificationService.update(id, notificationInput);
        return notification ? NotificationOutput.withOperation(notification) : null;
    }

    @Mutation(returns => Boolean)
    async deleteNotification(@Arg("id", {nullable: false}) id: string): Promise<Boolean> {
        return this.notificationService.delete(id);
    }
}