import { Notification } from "../model/Notification";


export interface NotificationRepository {
    findById(id: string): Promise<Notification | null>;

    findByIdWithFacility(id: string): Promise<Notification | null>;

    findAll(facilityId: string): Promise<Notification[]>;

    findAllWithFacility(facilityId: string): Promise<Notification[]>;

    findActive(facilityId: string): Promise<Notification[]>;

    findActiveWithFacility(facilityId: string): Promise<Notification[]>;

    findInactive(facilityId: string): Promise<Notification[]>;

    findInactiveWithFacility(facilityId: string): Promise<Notification[]>;

    save(notification: Notification): Promise<Notification>;

    update(id: string, notification: Notification): Promise<Notification | null>;

    delete(id: string): Promise<boolean>;

    notificationExists(id: string): Promise<boolean>;
    
    deleteNotificationForFacility(facilityId: string): Promise<any | null>;
}