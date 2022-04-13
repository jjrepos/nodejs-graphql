import { Notification, NotificationStatus, NotificationModel } from "../../src/api/model/Notification";
import { Facility, FacilityModel} from "../../src/api/model/Facility";
import { NotificationOutput } from "../../src/api/resolver/types/output/NotificationOutput";

import { notificationData, boozGarageClosing, boozGarageClosingWithNoEndDate, boozGarageInactive,
    boozGarageClosingInSepInput, boozGarageClosingInput, boozGarageClosingWithBeginDateLaterThanEndDateInput } from "../data/Notifications";
        
import { facilities, booz} from "../data/Facilities";

import { plainToClass } from "class-transformer";
import { NotificationComparator } from "../util/NotificationComparator";

import { client } from "../util/GraphQLClient";
import { gql } from "apollo-boost";
import { connection } from "mongoose";

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

describe("Notification Resolver Tests", () => {
    it("Resolver should find a notification, given notification id", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageInactive.title }).exec();
        
        let notification = gql`
        query {
            notification(id: "${notificationFound!._id}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
            }
        }`;
        let { data } = await client.query({ query: notification });

        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.notification).toBeDefined();
        expect(data.notification).not.toBeNull();
        let notificationOutput: NotificationOutput | null = data.notification;
        // notificationOutput.createdAt = new Date();
        NotificationComparator.compareAllFieldsFromResolver(notificationOutput!, notificationFound!);
    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should find a notification with facility, given notification id", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageInactive.title }).exec();
        
        let notification = gql`
        query {
            notification(id: "${notificationFound!._id}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive,
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: notification });

        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.notification).toBeDefined();
        expect(data.notification).not.toBeNull();
        let notificationOutput: NotificationOutput | null = data.notification;
        //notificationOutput.createdAt = new Date();
        NotificationComparator.compareAllFieldsWithFacilityFromResolver(notificationOutput!, notificationFound!,booz);
    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should return active notifications given facility id", async () => {

        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
   
        let allNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus: "${NotificationStatus.ACTIVE}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
            }
        }`;
        let { data } = await client.query({ query: allNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(2);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsFromResolver(notification, boozNotification);
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver should return active notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
   
        let allActiveNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus: "${NotificationStatus.ACTIVE}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive,
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: allActiveNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(2);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsWithFacilityFromResolver(notification, boozNotification, booz);

    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should return inactive notifications given facility id", async () => {

        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
   
        let allNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus: "${NotificationStatus.INACTIVE}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
            }
        }`;
        let { data } = await client.query({ query: allNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(1);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsFromResolver(notification, boozNotification);
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver should return inactive notifications with facility given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageInactive);
   
        let allActiveNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus: "${NotificationStatus.INACTIVE}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive,
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: allActiveNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(1);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsWithFacilityFromResolver(notification, boozNotification, booz);

    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should return all notification given facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
   
        let allNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus: "${NotificationStatus.ALL}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
            }
        }`;
        let { data } = await client.query({ query: allNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(3);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsFromResolver(notification, boozNotification);
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver should return all notification given notification id and facility id", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosing);
   
        let allNotifications = gql`
        query {
            allNotifications(facilityId: "${booz._id}", notificationStatus:"${NotificationStatus.ALL}") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                facility {id, name, campusCode,
                    address {street1, city, stateCode, zipCode},
                    location {type, coordinates}
                }
            }
        }`;
        let { data } = await client.query({ query: allNotifications });
        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.allNotifications).toBeDefined();
        expect(data.allNotifications).not.toBeNull();
        expect(data.allNotifications).toHaveLength(3);
        let notification: NotificationOutput = data.allNotifications[0];
        notification.createdAt = new Date(notification.createdAt);
        NotificationComparator.compareAllFieldsWithFacilityFromResolver(notification, boozNotification, booz);
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver should create a new notification", async () => {
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosingInput);
        let saveNotification = gql`
        mutation {
            saveNotification(input: {
                title: "${boozGarageClosingInput.title}", 
                desc: "${boozGarageClosingInput.desc}", 
                startsOn: "${boozGarageClosingInput.startsOn}", 
                endsOn: "${boozGarageClosingInput.endsOn}",
                facility: "${boozGarageClosingInput.facility}"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                }
        }`;

        let { data } = await client.mutate({ mutation: saveNotification });
        expect(data).toBeDefined();
        expect(data.saveNotification).toBeDefined();
        let notificationOutput: NotificationOutput = data.saveNotification;
        notificationOutput.createdAt = new Date(notificationOutput.createdAt);
        NotificationComparator.compareAllFieldsFromResolver(notificationOutput, boozNotification);
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver update an existing notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosing.title }).exec();
        let boozNotification: Notification = plainToClass(Notification, boozGarageClosingInSepInput);

        let updateNotification = gql`
        mutation {
            updateNotification(id: "${notificationFound!._id.toString()}", input: {
                title: "${boozGarageClosingInSepInput.title}", 
                desc: "${boozGarageClosingInSepInput.desc}", 
                startsOn: "${boozGarageClosingInSepInput.startsOn}", 
                endsOn: "${boozGarageClosingInSepInput.endsOn}",
                facility: "${boozGarageClosingInSepInput.facility}"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                }
            }`;  
        let { data } = await client.mutate({ mutation: updateNotification });
        expect(data).toBeDefined();
        expect(data.updateNotification!).not.toBeNull();
        let notificationOutput: NotificationOutput = data.updateNotification;
        NotificationComparator.compareAllFieldsFromResolver(notificationOutput, boozNotification);
    });
});



describe("Notification Resolver Tests", () => {
    it("Resolver should delete a notification", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageClosingWithNoEndDate.title }).exec();

        let deleteNotification = gql`
        mutation {
             deleteNotification(id: "${notificationFound!._id.toString()}") 
        }`;
        let { data } = await client.mutate({ mutation: deleteNotification });

        expect(data).toBeDefined();
        expect(data.deleteNotification).toBeDefined();
        expect(data.deleteNotification).toEqual(true);
    });
});


//all -ve test cases
describe("Notification Resolver Tests", () => {
    it("Resolver should error to delete a notification, if notification does not exist", async () => {

        const deleteNotification = gql`
        mutation {
            deleteNotification(id: "5f05d1514b5dcbb405111945")
        }`;
        await expect(client.mutate({
            mutation: deleteNotification
        })).rejects.toThrowError("GraphQL error: Unable to delete notification 5f05d1514b5dcbb405111945. Notification not found.")
    });
});


describe("Notification Resolver Tests", () => {
    it("Resolver should error to update a notification, if notification does not exist", async () => {
        const updateNotification = gql`
        mutation {
            updateNotification(id: "5f05d1474b5dcbb405000935", , input: {
                title: "${boozGarageClosingInSepInput.title}", 
                desc: "${boozGarageClosingInSepInput.desc}", 
                startsOn: "${boozGarageClosingInSepInput.startsOn}", 
                endsOn: "${boozGarageClosingInSepInput.endsOn}",
                facility: "${boozGarageClosingInSepInput.facility}"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                } 
        }`;
        await expect(client.mutate({
            mutation: updateNotification
        })).rejects.toThrowError("Unable to update notification 5f05d1474b5dcbb405000935. Notification not found.")
    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should error to update a notification, startsOn prior to endsOn", async () => {
        const updateNotification = gql`
        mutation {
            updateNotification(id: "5f05d1474b5dcbb405000935", , input: {
                title: "${boozGarageClosingWithBeginDateLaterThanEndDateInput.title}", 
                desc: "${boozGarageClosingWithBeginDateLaterThanEndDateInput.desc}", 
                startsOn: "${boozGarageClosingWithBeginDateLaterThanEndDateInput.startsOn}", 
                endsOn: "${boozGarageClosingWithBeginDateLaterThanEndDateInput.endsOn}",
                facility: "${boozGarageClosingWithBeginDateLaterThanEndDateInput.facility}"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                } 
        }`;
        await expect(client.mutate({
            mutation: updateNotification
        })).rejects.toThrowError("StartsOn should be prior to EndsOn")
    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should error to save a notification, facility should not exist", async () => {
        let saveNotification = gql`
        mutation {
            saveNotification(input: {
                title: "${boozGarageClosingInput.title}", 
                desc: "${boozGarageClosingInput.desc}", 
                startsOn: "${boozGarageClosingInput.startsOn}", 
                endsOn: "${boozGarageClosingInput.endsOn}",
                facility: "AAA"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                }
        }`;
        await expect(client.mutate({
            mutation: saveNotification
        })).rejects.toThrowError("GraphQL error: Facility AAA does not exist");
    });
});

describe("Notification Resolver Tests", () => {
    it("Resolver should error to update a notification, facility should not exist", async () => {
        let notificationFound: Notification  | null = await NotificationModel.findOne({ title: boozGarageInactive.title }).exec();
        
        const updateNotification = gql`
        mutation {
            updateNotification(id: "${notificationFound!._id}", , input: {
                title: "${boozGarageClosingInSepInput.title}", 
                desc: "${boozGarageClosingInSepInput.desc}", 
                startsOn: "${boozGarageClosingInSepInput.startsOn}", 
                endsOn: "${boozGarageClosingInSepInput.endsOn}",
                facility: "AAA"
            }) {
                    id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
                } 
        }`;
        await expect(client.mutate({
            mutation: updateNotification
        })).rejects.toThrowError("GraphQL error: Facility AAA does not exist");
    });
});



describe("Notification Resolver Tests", () => {
    it("Resolver should not find a notification, notification should not exist given facility id", async () => {
        let notification = gql`
        query {
            notification(id: "AAAAAAAAAAAA") {
                id, title, desc, startsOn, endsOn, createdAt, updatedAt, isActive
            }
        }`;
        let { data } = await client.query({ query: notification });

        expect(data).toBeDefined();
        expect(data).not.toBeNull();
        expect(data.notification).toBeNull();
    });
});
