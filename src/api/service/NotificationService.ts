import { assert } from "console";
import { Notification, NotificationStatus } from "../model/Notification";
import { NotificationRepository } from "../repository/NotificationRepository";
import { NotificationRepositoryImpl } from "../repository/NotificationRepositoryImpl";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";

import { Transaction } from "../repository/util/Transaction";
import { NotificationInput } from "../resolver/types/input/NotificationInput";
import { DateValidator } from "../repository/util/validator/DateValidator";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";

export class NotificationService {
    private readonly repository: NotificationRepository = new NotificationRepositoryImpl();
    private readonly facilityRepository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly validator: DateValidator = new DateValidator();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();

    async getNotification(id: string): Promise<Notification | null> {
        return await this.repository.findById(id);
    }

    async getNotificationWithFacility(id: string): Promise<Notification | null> {
        return await this.repository.findByIdWithFacility(id);
    }

    async getAllNotifications(facilityId: string, notificationStatus: NotificationStatus): Promise<Notification[]> {
         if (notificationStatus == NotificationStatus.ACTIVE) {
            return await this.repository.findActive(facilityId);
        } else if (notificationStatus == NotificationStatus.INACTIVE) {
            return await this.repository.findInactive(facilityId);
        } else if (notificationStatus == NotificationStatus.ALL) {
            return await this.repository.findAll(facilityId);
        }
        throw new Error(`Notification Status ${notificationStatus} does not exist`);
    }

    async getAllNotificationsWithFacility(facilityId: string, notificationStatus: NotificationStatus): Promise<Notification[]> {
        if (notificationStatus == NotificationStatus.ACTIVE) {
            return await this.repository.findActiveWithFacility(facilityId);
        } else if (notificationStatus == NotificationStatus.INACTIVE) {
            return await this.repository.findInactiveWithFacility(facilityId);
        } else if (notificationStatus == NotificationStatus.ALL) {
            return await this.repository.findAllWithFacility(facilityId);
        }
        throw new Error(`Notification Status ${notificationStatus} does not exist`);
    }

    async save(input: NotificationInput): Promise<Notification |null>{
        assert(input);

        let facilityResponse = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityResponse) {
            throw new Error("Facility " + input.facility + " does not exist");
        }
        let notification = Notification.withInput(input);
       
        let error = this.validator.compareBeginDateAndEndDate(notification.startsOn, notification.endsOn!);
        if (error) {
            throw new Error("StartsOn should be prior to EndsOn");
        }
        let endsOnError = this.validator.isDateInPast(notification.endsOn!);
        if (endsOnError) {
            throw new Error("EndsOn cannot be in the past");
        }
        let sameDateError = this.validator.compareDatesAreSame(notification.startsOn, notification.endsOn!);
        if (sameDateError) {
            throw new Error("StartsOn and EndsOn cannot be the same. Check the date and time.");
        }
        let stringError = this.inputStringValidator.validate(notification);
        if (stringError) {
            throw stringError;
        } 
        return await this.repository.save(notification);
    }


    async update(id: string, input: NotificationInput): Promise<Notification | null> {
        assert(input);
        assert(id);
        let facilityResponse = await this.facilityRepository.facilityExists(input.facility);
        if (!facilityResponse) {
            throw new Error("Facility " + input.facility + " does not exist");
        }
        let notification = Notification.withInput(input);

        let error = this.validator.compareBeginDateAndEndDate(notification.startsOn, notification.endsOn!);
        if (error) {
            throw new Error("StartsOn should be prior to EndsOn");
        }
        let endsOnError = this.validator.isDateInPast(notification.endsOn!);
        if (endsOnError) {
            throw new Error("EndsOn cannot be in the past");
        }

        let sameDateError = this.validator.compareDatesAreSame(notification.startsOn, notification.endsOn!);
        if (sameDateError) {
            throw new Error("StartsOn and EndsOn cannot be the same. Check the date and time.");
        }
        let stringError = this.inputStringValidator.validate(notification);
        if (stringError) {
            throw stringError;
        } 
        let notificationResponse = await this.repository.update(id, notification);
        if (notificationResponse) {
            return notificationResponse;
        } else {
            throw new Error("Unable to update notification " + id + ". Notification not found.");
        }
    }

    @Transaction
    async delete(id: string): Promise<Boolean> {
        assert(id);
    
        let facilityResponse = await this.repository.delete(id);
        if (facilityResponse) {
            return Boolean(true);
        } else {
            throw new Error("Unable to delete notification " + id + ". Notification not found.");
        }
    }

}