import { Notification, NotificationModel, NotificationStatus } from "../../src/api/model/Notification";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { NotificationService } from "../../src/api/service/NotificationService";

import { notificationData, boozGarageClosing, boozGarageClosingWithNoEndDate, boozGarageInactive,
    boozGarageClosingInSepInput, boozGarageClosingInput, boozGarageClosingWithBeginDateLaterThanEndDateInput, blankInput } from "../data/Notifications";
import { facilities, booz} from "../data/Facilities";

import { plainToClass } from "class-transformer";
import { NotificationComparator } from "../util/NotificationComparator";

import { connection } from "mongoose";

const service: NotificationService = new NotificationService;

beforeAll(async () => {
    await connection.db.dropDatabase();
    await FacilityModel.create(facilities);

    let booz: Facility | null = await FacilityModel.findById("BOOZ").exec();
    let notifications: Notification[] = plainToClass(Notification, notificationData);

    notifications[0].facility = booz!;
    notifications[1].facility = booz!;
    notifications[2].facility = booz!;
  
    await NotificationModel.create(notifications);
});

afterAll(async () => {
    await connection.db.dropDatabase();
});


describe("Notification Service Tests", () => {
    it("Service should return active notifications given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await service.getAllNotifications(booz._id, NotificationStatus.ACTIVE);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(2)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return active notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await service.getAllNotificationsWithFacility(booz._id, NotificationStatus.ACTIVE);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(2)
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return inactive notifications given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
        const notifications: Notification[] = await service.getAllNotifications(booz._id, NotificationStatus.INACTIVE);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(1)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return inactive notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
        const notifications: Notification[] = await service.getAllNotificationsWithFacility(booz._id, NotificationStatus.INACTIVE);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(1)
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return all notification given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await service.getAllNotifications(booz._id,  NotificationStatus.ALL);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(3)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return all notification with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await service.getAllNotificationsWithFacility(booz._id,  NotificationStatus.ALL);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(3)
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return notification given notification id and facility id", async () => {
        let notification: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        const notificationResult: Notification | null = await service.getNotification(notification!._id.toHexString());
        
        expect(notificationResult).not.toBeNull();
        NotificationComparator.compareAllFields(notificationResult!, notification!);
    });
});

describe("Notification Service Tests", () => {
    it("Service should return notification with facility given notification id and facility id", async () => {
        let notification: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        const notificationResult: Notification | null= await service.getNotificationWithFacility(notification!._id.toHexString());

        expect(notificationResult).not.toBeNull();
        NotificationComparator.compareAllFieldsWithFacility(notificationResult!, notification!, booz!);
    });
});



describe("Notification Service Tests", () => {
    it("Service should create a new notification", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosingInput);
        let notification: Notification  = await service.save(boozGarageClosingInput);
        expect(notification).not.toBeNull();
        NotificationComparator.compareAllFields(notification, boozNotification);
    });
});

describe("Notification Service Tests", () => {
    it("Service should update an existing notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosingInSepInput);

        let notification: Notification | null = await service.update(notificationFound!._id.toString(), boozGarageClosingInSepInput);
        expect(notification!).not.toBeNull();
        NotificationComparator.compareAllFields(notification!, boozNotification);
    });
});

describe("Notification Service Tests", () => {
    it("Service should delete a notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosingWithNoEndDate.title }).exec();

        let notification = await service.delete(notificationFound!._id.toString());
        expect(notification).not.toBeNull();
        expect(notification).toEqual(true);
    });
});

// -ve test case 
describe("Notification Service Tests", () => {
    it("Service should error to delete a notification, if notification does not exist", async () => {
        await expect(service.delete("5f05d1474b5dcbb405000935")
        ).rejects.toThrowError("Unable to delete notification 5f05d1474b5dcbb405000935. Notification not found.")
    });
});

describe("Notification Service Tests", () => {
    it("Service should error to update a notification, if notification does not exist", async () => {
        await expect(service.update("5f05d1474b5dcbb405000935", boozGarageClosingInSepInput)
        ).rejects.toThrowError("Unable to update notification 5f05d1474b5dcbb405000935. Notification not found.")
    });
});


describe("Notification Service Tests", () => {
    it("Service should should not find a notification, notification should not exist with given facility id", async () => {
        const notification: Notification | null = await service.getNotification("5f05d1474b5dcbb405111935");
        expect(notification).toBeNull();
    });
});

describe("Notification Service Tests", () => {
    it("Service should not find a notification, notification should not exist with given notificaton id and facility id", async () => {
        const notification: Notification | null = await service.getNotificationWithFacility("5f05d1474b5dcbb405111935");
        expect(notification).toBeNull();
    });
});

describe("Notification Service Tests", () => {
    it("Service should error on save, if startsOn is later then endsOn", async () => {
        await expect(service.save(boozGarageClosingWithBeginDateLaterThanEndDateInput)
        ).rejects.toThrowError("StartsOn should be prior to EndsOn");
    });
});

describe("Notification Service Tests", () => {
    it("Service should error to save a notification, variables should not contain blank spaces only", async () => {
        await expect(service.save(blankInput)
        ).rejects.toThrowError("title, desc should not contain blank spaces only.");
    });
});
