
//import { ZonedDateTime,  LocalDate, LocalTime, convert, ZoneId} from "@js-joda/core";

export class DateValidator  {
    validate(dateString: string): Error | Date {
        
        let dateMatcher = dateString.substr(0,10).match(/[\d]{4}-[\d]{2}-[\d]{2}?/);
        if (!dateMatcher) {
            return new Error("should be in format YYYY-MM-dd or YYYY-MM-ddThh:mm:ssZ");
        }

        let convertedDate = new Date(Date.parse(dateString));
        return convertedDate;
        /* based on js-joda library
        if (dateString.length <=10) {
            try { 
               //let dt = ZonedDateTime.of(LocalDate.parse(dateString),LocalTime.MIDNIGHT,ZoneId.UTC);
               //let convertedDate = convert(dt, ZoneId.UTC).toDate();
               return convertedDate;
            } catch (error) {
                return new Error("should be in format YYYY-MM-dd");
            }
        } else {
            try {
                //let dt = ZonedDateTime.parse(dateString);
                //let convertedDate = convert(dt, ZoneId.UTC).toDate();
                return convertedDate;
             } catch (error) {
                 return new Error("should be in format YYYY-MM-ddThh:mm:ss+00:00");
             }
        }
        */
    }


    compareBeginDateAndEndDate(beginDate: Date, endDate?: Date): boolean {
        if (endDate! != null  && beginDate > endDate!) {
            return true;
        }
        return false;
    }

    isDateInPast(date?: Date): boolean {
        if (date! != null && date < new Date()) {
            return true;
        }
        return false;
    }

    compareDatesAreSame(beginDate: Date, endDate?: Date): boolean {
        if (endDate! != null  && beginDate.toISOString() == endDate!.toISOString()) {
            return true;
        }
        return false;
    }

    
}