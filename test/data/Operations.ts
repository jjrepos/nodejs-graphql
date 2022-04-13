import { OperationInput } from "../../src/api/resolver/types/input/OperationInput";
import { Day } from "../../src/api/model/OperationalHours";

export const cleaningOperation = {
    "facility": "BOOZ",
    "desc": "Provided by property management. Cleaning for all unlocked areas at night. Contact the Help Desk, at 877-927-8278, for additional services",
    "poc": null,
    "email": null,
    "phone": "877-927-8278",
    "url": null,
    "room": null,
    "operationalHours": [
        {
            "day": "Sunday",
            "openTime": "0:00 AM",
            "closeTime": "0:00 PM"
        },
        {
            "day": "Monday",
            "openTime": "7:30 AM",
            "closeTime": "4:30 PM"
        },
        {
            "day": "Tuesday",
            "openTime": "7:30 AM",
            "closeTime": "4:30 PM"
        },
        {
            "day": "Wednesday",
            "openTime": "7:30 AM",
            "closeTime": "4:30 PM"
        },
        {
            "day": "Thursday",
            "openTime": "7:30 AM",
            "closeTime": "4:30 PM"
        },
        {
            "day": "Friday",
            "openTime": "7:30 AM",
            "closeTime": "4:30 PM"
        },
        {
            "day": "Saturday",
            "openTime": "0:00 AM",
            "closeTime": "0:00 PM"
        }
    ]
};


export const updateDistributionOperationInput: OperationInput = {    
    type: "DISTRIBUTION_SERVICE",
    facility: "BOOZ",
    desc: "Located on the 1st floor - Updated",
    poc: "",
    email: "OF_Herndon_Parkway_Distribution@bah.com",
    phone: "571-346-5000",
    url: "",
    room: "",
    operationalHours: [
        {
            day: Day.Sunday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Monday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Tuesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Wednesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Thursday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Friday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Saturday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        }
    ]
};

export const distributionOperationInput: OperationInput = {    
    type: "DISTRIBUTION_SERVICE",
    facility: "BOOZ",
    desc: "Located on the 1st floor. Closed 1 hour for lunch. Staff will receive an e-mail notification when mail is received.",
    poc: "",
    email: "OF_Herndon_Parkway_Distribution@bah.com",
    phone: "571-346-5000",
    url: "",
    room: "",
    operationalHours: [
        {
            day: Day.Sunday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Monday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Tuesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Wednesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Thursday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Friday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Saturday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        }
    ]
};

export const blankOperationInput: OperationInput = {    
    type: "DISTRIBUTION_SERVICE",
    facility: "BOOZ",
    desc: "  ",
    poc: "  ",
    email: "  ",
    phone: "  ",
    url: "  ",
    room: "  ",
    operationalHours: [
        {
            day: Day.Sunday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Monday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Tuesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Wednesday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Thursday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Friday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        },
        {
            day: Day.Saturday,
            openTime: "6:00 AM",
            closeTime: "10:00 PM"
        }
    ]
};

export const operationsData = [ cleaningOperation];
