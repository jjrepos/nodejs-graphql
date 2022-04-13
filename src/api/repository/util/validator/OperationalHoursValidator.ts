
import { OperationalHours } from "../../../model/OperationalHours";
import { Validator } from "./Validator";

export class OperationalHoursValidator implements Validator {
    validate(operationalHours: OperationalHours[]): Error | null {
        if(!operationalHours || operationalHours.length != 7) {
            return new Error("Operational Hours days missing.");
        } else {
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            for (let i = 0; i < operationalHours.length; i++) {
                let operationalHour = operationalHours[i];
                let index = days.indexOf(operationalHour.day);
                if (index >= 0) {
                    days.splice(index, 1);
                }
                let openResult = operationalHour.openTime.match(/(\d+:\d+\s\w[Mm$])/);
                let closeResult = operationalHour.closeTime.match(/(\d+:\d+\s\w[Mm$])/);
                if (!openResult || !closeResult) {
                    return new Error("Incorrect hours format. Make sure you enter the operation hours in the format of 9:00 AM or 5:30 PM.");;
                }
            };
            if (days.length > 0) {
                return new Error("Duplicate days found.");
            }
        }

        return null;
    }

    
}