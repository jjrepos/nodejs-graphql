import { NotificationInput } from "../../src/api/resolver/types/input/NotificationInput";


export const boozGarageClosing = {
    "title": "Garage closing",
    "desc": "closing garage",
    "startsOn": "2020-08-12",
    "endsOn": "2022-09-30"
};

export const boozGarageClosingWithNoEndDate = {
    "title": "Garage closing at BOOZ",
    "desc": "near by garage closing",
    "startsOn": "2020-08-12",
    "endsOn": null
    
};

export const boozGarageInactive = {
    "title": "Garage closing at BOOZ1",
    "desc": "near by garage closing",
    "startsOn": "2020-08-12",
    "endsOn": "2020-08-15"
    
};



export const boozGarageClosingInput: NotificationInput = {    
    "title": "Garage closing1",
    "desc": "closing garage",
    "startsOn": "2020-08-12",
    "endsOn": "2022-08-26",
    "facility": "BOOZ"
};

export const boozGarageClosingInSepInput = {    
    "title": "Garage closing1",
    "desc": "closing garage",
    "startsOn": "2020-08-12",
    "endsOn": "2022-09-12",
    "facility": "BOOZ"
};

export const boozGarageClosingWithNoEndDateInput = {    
    "title": "Garage closing1",
    "desc": "closing garage",
    "startsOn": "2020-08-12",
    "endsOn": null,
    "facility": "BOOZ"
};

export const boozGarageClosingWithBeginDateLaterThanEndDateInput: NotificationInput = {    
    "title": "Garage closing3",
    "desc": "closing garage",
    "startsOn": "2020-08-25",
    "endsOn": "2020-08-20",
    "facility": "BOOZ"
};

export const blankInput: NotificationInput = {    
    "title": "  ",
    "desc": "  ",
    "startsOn": "2020-08-25",
    "endsOn": "2022-08-29",
    "facility": "BOOZ"
};

export const notificationData = [ boozGarageClosing, boozGarageClosingWithNoEndDate, boozGarageInactive ];
