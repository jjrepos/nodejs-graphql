export const bikeRackAmenityData = {
    "desc": "Located in the Booz garage, P2 level, and the Allen garage, L1 level",
    "email": null,
    "phone": null,
    "url": null,
    "onsite": true
}

export const withOpHoursNoAddrsBikeRackAmenityData = {
    "desc": "Located in the Booz garage, P2 level, and the Allen garage, L1 level",
    "email": null,
    "phone": null,
    "url": null,
    "onsite": false,
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
}

export const withincorrectOpHoursAddrsBikeRackAmenityData = {
    "desc": "Located in the Booz garage, P2 level, and the Allen garage, L1 level",
    "email": null,
    "phone": null,
    "url": null,
    "onsite": false,
    "address": {
        "street1": "4567 bah way",
        "city": "McLean",
        "stateCode": "VA",
        "countryCode": "USA"
      },
    "operationalHours": [
        {
            "day": "Monday",
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
}

export const printingAmenityData = {
    "desc": "Located in Hamilton H-6005, H-8015, and B-3072. The access code can be obtained from Facilities Operations. ",
    "email": null,
    "phone": null,
    "url": null,
    "onsite": true
}

export const faxMachineAmenityData = {
    "desc": "Located in the Hamilton Lower Level. Showers available. To use the Center, staff must sign a release form, available from Access Control Office, Booz 1009. Hours of Operation: 24 hours with badge",
    "email": null,
    "phone": null,
    "url": null,
    "onsite": true
}

export const toUpdateFaxMachineAmenityData = {
    "desc": "Located in the Hamilton Lower Level. Showers available. To use the Center, staff must sign a release form, available from Access Control Office, Booz 1009. Hours of Operation: 24 hours with badge",
    "email": "updated_fax@bah.com",
    "phone": null,
    "url": "boozfax.bah.com",
    "onsite": true
}

export const blankAmenityData = {
    "type": "PRINTING",
    "facility": "HMLT",
    "desc": "  ",
    "email": "  ",
    "phone": "   ",
    "url": "   ",
    "onsite": false,
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
}

export const amenitiesData = [bikeRackAmenityData, printingAmenityData];