import { TransportationType } from "../../src/api/model/TransportationType";

export const parking = {
    name: "PARKING",
    desc: "Parking"
} as TransportationType

export const visitorParking = {
    name: "VISITOR_PARKING",
    desc: "Visitor Parking"
} as TransportationType

export const metro = {
    name: "METRO",
    desc: "Metro Locations"
} as TransportationType

export const upgradeParking = {
    name: "PARKING_UPGRADED",
    desc: "Parking upgraded"
} as TransportationType

export const upgradeMetro = {
    name: "METRO_UPGRADED",
    desc: "Metro upgraded"
} as TransportationType

export const blankType = {
    name: "   ",
    desc: "   "
} as TransportationType

export const transportationTypes = [parking, visitorParking];
