import { Address } from "../../src/api/model/Address";
import { Facility, FacilityType, OperationalStatus, ClassificationType } from "../../src/api/model/Facility";
import { CoordinateType, Location } from "../../src/api/model/Location";
import { Day, OperationalHours } from "../../src/api/model/OperationalHours";
import { TransportationType } from "../../src/api/model/TransportationType";
import { FacilityInput } from "../../src/api/resolver/types/input/FacilityInput";
import { LocationInput } from "../../src/api/resolver/types/input/LocationInput";


export const officeHours: OperationalHours[] =
    [
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
    ];


export const mcleanAddress: Address = {
    street1: "8283 Greensboro Dr",
    city: "McLean",
    zipCode: "22102",
    stateCode: 'VA',
    state: "VIRGINIA",
    countryCode: 'USA',
    country: "UNITED STATES OF AMERICA"
};

export const mcleanLocation: Location = {
    coordinates: [-77.231060, 38.922620],
    type: CoordinateType.Point
};



export const booz: Facility = {
    _id: "BOOZ",
    name: "Booz Building",
    campusCode: "MCLN",
    address: mcleanAddress,
    timeZone: "EST",
    location: mcleanLocation,
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    createdAt: new Date(),
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const hamilton: Facility = {
    _id: "HMLT",
    name: "Hamilton Building",
    campusCode: "MCLN",
    address: mcleanAddress,
    timeZone: "EST",
    location: mcleanLocation,
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    createdAt: new Date(),
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const allen: Facility = {
    _id: "ALEN",
    name: "Allen Building",
    campusCode: "MCLN",
    address: mcleanAddress,
    timeZone: "EST",
    location: mcleanLocation,
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    createdAt: new Date(),
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const upgradeBooz: Facility = {
    _id: "BOOZ",
    name: "Booz Building Upgraded",
    campusCode: "MCLN",
    address: {
        street1: "8285 Greensboro Dr",
        street2: "Suite 100",
        city: "McLean",
        zipCode: "22102",
        stateCode: "VA",
        state: "VIRGINIA",
        countryCode: "USA",
        country: "UNITED STATES OF AMERICA"
    },
    timeZone: "EST",
    location: {
        coordinates: [-77.231060, 38.922620],
        type: CoordinateType.Point
    },
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    createdAt: new Date(),
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const boozTransportationData = {
    "facility": "BOOZ",
    "desc": "Located in the front of the building updated",
    "email": "facilities@bah.com",
    "phone": "571-390-0808",
    "url": null,
    "onsite": true,
    "operationalHours": [
        {
            "day": "Sunday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Monday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Tuesday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Wednesday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Thursday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Friday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        },
        {
            "day": "Saturday",
            "openTime": "6:00 AM",
            "closeTime": "10:00 PM"
        }
    ]
};

export const parking = {
    name: "PARKING",
    desc: "Parking"
} as TransportationType;


export const facilities = [booz, hamilton];
export const transports = [boozTransportationData];
export const transportationTypes = [parking];

export const mcleanLocationInput: LocationInput = {
    coordinates: [{
        longitude: -77.231060,
        latitude: 38.922620
    }],
    type: CoordinateType.Point
};

export const allenInput: FacilityInput = {
    id: "ALEN",
    name: "Allen Building",
    campusCode: "MCLN",
    timeZone: "EST",
    address: mcleanAddress,
    location: {
        coordinates: [{
            longitude: -77.231060,
            latitude: 38.922620
        }],
        type: CoordinateType.Point
    },
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const upgradeBoozInput = {
    id: "BOOZ",
    name: "Booz Building Upgraded",
    campusCode: "MCLN",
    timeZone: "EST",
    address: {
        street1: "8285 Greensboro Dr",
        city: "McLean",
        zipCode: "22102",
        stateCode: "VA",
        countryCode: "USA"
    },
    location: {
        coordinates: [{
            longitude: -77.231060,
            latitude: 38.922620
        }],
        type: CoordinateType.Point
    },
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const crystalInput: FacilityInput = {
    id: "CRYS",
    name: "Crystal Building",
    campusCode: "",
    timeZone: "EST",
    address: {
        street1: "",
        city: "",
        zipCode: "",
        stateCode: "VA",
        countryCode: "USA"
    },
    location: {
        coordinates: [{
            longitude: -77.33,
            latitude: 37.922620
        }],
        type: CoordinateType.Point
    },
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "This is test",
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};

export const crystalBlankInput: FacilityInput = {
    id: "CRYS",
    name: "  ",
    campusCode: "  ",
    timeZone: "  ",
    address: {
        street1: " ",
        city: " ",
        zipCode: " ",
        stateCode: "  ",
        countryCode: "  "
    },
    location: {
        coordinates: [{
            longitude: -77.33,
            latitude: 37.922620
        }],
        type: CoordinateType.Point
    },
    officeHours: officeHours,
    hotelingSite: true,
    facilityType: FacilityType.OFFICE,
    otherDetail: "  ",
    operationalStatus: OperationalStatus.OPEN,
    classificationType: ClassificationType.CLEARED
};



