import { Notification, NotificationModel } from "../../src/api/model/Notification";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { NotificationRepository } from "../../src/api/repository/NotificationRepository";
import { NotificationRepositoryImpl } from "../../src/api/repository/NotificationRepositoryImpl";

import { notificationData, boozGarageClosing, boozGarageInactive,
    boozGarageClosingWithNoEndDate, boozGarageClosingInput, boozGarageClosingWithBeginDateLaterThanEndDateInput } from "../data/Notifications";

import { facilities, booz} from "../data/Facilities";
import { plainToClass } from "class-transformer";
import { NotificationComparator } from "../util/NotificationComparator";
import { connection } from "mongoose";

const repo: NotificationRepository = new NotificationRepositoryImpl();

beforeAll(async () => {
    //await NotificationModel.collection.drop();
    //await FacilityModel.collection.drop();
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
    //await NotificationModel.collection.drop();
    await connection.db.dropDatabase();
});


describe("Notification Repository Tests", () => {
    it("Repository should return all notifications given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await repo.findAll("BOOZ");
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(3)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2021-09-30T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return all notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await repo.findAllWithFacility("BOOZ");
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(3);
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2021-09-30T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return active notifications given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await repo.findActive("BOOZ");
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(2)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2021-09-30T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return active notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
        const notifications: Notification[] = await repo.findActiveWithFacility("BOOZ");
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(2);
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2021-09-30T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return inactive notifications given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
        const notifications: Notification[] = await repo.findInactive(booz._id);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(1)
        NotificationComparator.compareAllFields(notifications[0], boozNotification);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2020-08-15T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return inactive notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
        const notifications: Notification[] = await repo.findInactiveWithFacility(booz._id);
        expect(notifications).not.toBeNull();
        expect(notifications).toHaveLength(1)
        NotificationComparator.compareAllFieldsWithFacility(notifications[0], boozNotification, booz);
        //expect(notifications[0].startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notifications[0].endsOn.toJSON()).toStrictEqual("2020-08-15T04:00:00.000Z");
    });
});


describe("Notification Repository Tests", () => {
    it("Repository should return notifications given notification id", async () => {
        let notification: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        const notificationResult: Notification  | null = await repo.findById(notification!._id.toHexString());
        expect(notificationResult).not.toBeNull();
        NotificationComparator.compareAllFields(notificationResult!, notification!);
        //expect(notificationResult.startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notificationResult.endsOn.toJSON()).toStrictEqual("2021-08-15T04:00:00.000Z");
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should return notification with facility given notification id", async () => {
        let notification: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        const notificationResult: Notification | null = await repo.findByIdWithFacility(notification!._id.toHexString());

        expect(notificationResult).not.toBeNull();
        NotificationComparator.compareAllFieldsWithFacility(notificationResult!, notification!, booz!);
        //expect(notificationResult.startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notificationResult.endsOn.toJSON()).toStrictEqual("2021-09-30T04:00:00.000Z");
    });
});


describe("Notification Repository Tests", () => {
    it("Repository should create a new notification", async () => {
        let notificationInput: Notification = Notification.withInput(boozGarageClosingInput);
        let boozNotification: Notification = plainToClass(Notification, notificationInput);
        let notification: Notification | null = await repo.save(notificationInput);
        expect(notification).not.toBeNull();
        NotificationComparator.compareAllFields(notification, boozNotification);
        //expect(notification.startsOn.toJSON()).toStrictEqual("2020-08-12T04:00:00.000Z");
        //expect(notification.endsOn.toJSON()).toStrictEqual("2021-08-26T04:00:00.000Z");
    });
});


describe("Notification Repository Tests", () => {
    it("Repository should update an existing notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();

        let notificationInput: Notification = Notification.withInput(boozGarageClosingWithBeginDateLaterThanEndDateInput);
        let boozNotification: Notification = plainToClass(Notification, notificationInput);

        let notification: Notification | null = await repo.update(notificationFound!._id.toString(), notificationInput);
        expect(notification!).not.toBeNull();
        NotificationComparator.compareAllFields(notification!, boozNotification);
    });
});


describe("Notification Repository Tests", () => {
    it("Repository should delete an existing notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosingWithNoEndDate.title }).exec();

        let notification = await repo.delete(notificationFound!._id.toString());
        expect(notification).not.toBeNull();
        expect(notification).toEqual(true);
    });
});


// -ve test cases
describe("Notification Repository Tests", () => {
    it("Repository should error to delete a notification, if notification does not exist", async () => {
        const notification = await repo.delete("5f05d1474b5dcbb405111935");
        expect(notification).not.toBeNull();
        expect(notification).toEqual(false);
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should error to update a notification, if notification does not exist", async () => {
        let notificationInput: Notification = Notification.withInput(boozGarageClosingWithBeginDateLaterThanEndDateInput);
        let boozNotification: Notification = plainToClass(Notification, notificationInput);

        const notification: Notification | null = await repo.update("5f05d1474b5dcbb405111935", boozNotification);
        expect(notification).toBeNull();
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should not find a notification, notification should not exist with given facility id", async () => {
        const notification: Notification[] = await repo.findAllWithFacility("ZZZZ");
        expect(notification).not.toBeNull();
        expect(notification).toHaveLength(0);
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should not find a notification, notification should not exist with given notificaton id and facility id", async () => {
        const notification: Notification | null = await repo.findById("5f05d1474b5dcbb405111935");
        expect(notification).toBeNull();
    });
});

describe("Notification Repository Tests", () => {
    it("Repository should not find a notification with facility, notification should not exist with given notification id and facility id", async () => {
        const notification: Notification | null = await repo.findByIdWithFacility("5f05d1474b5dcbb405111935");
        
        expect(notification).toBeNull();
    });
});
