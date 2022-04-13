import { OperationType } from "../../src/api/model/OperationType";


export const distribution = {
    "name": "DISTRIBUTION_SERVICE",
    "desc": "Distribution Service"
} as OperationType;

export const distributionTest = {
    "name": "DISTRIBUTION_SERVICE_TEST",
    "desc": "Distribution Service Test"
} as OperationType;

export const cleaning = {
    "name": "CLEANING_SERVICE",
    "desc": "Cleaning Service"
} as OperationType;

export const cleaningUpdate = {
    "name": "CLEANING_SERVICE",
    "desc": "Cleaning Service Update"
} as OperationType;

export const accessControl = {
    "name": "ACCESS_CONTROL_OFFICE_SERVICE",
    "desc": "Access Control Office"
} as OperationType;

export const reception = {
    "name": "RECEPTION_SERVICE",
    "desc": "Reception Service"
} as OperationType;

export const facilityMang = {
    "name": "FACILITY_MANAGEMENT_SERVICE",
    "desc": "Facility Management"
} as OperationType;

export const greenOffice = {
    "name": "GREEN_OFFICE_TEAM_SERVICE",
    "desc": "Green Office Team"
} as OperationType;

export const concierge = {
    "name": "CONCIERGE_SERVICE",
    "desc": "Concierge"
} as OperationType;

export const meeting = {
    "name": "MEETING_SERVICE",
    "desc": "Meeting Service"
} as OperationType;

export const recycle = {
    "name": "RECYCLING_SERVICE",
    "desc": "Recycling"
} as OperationType;

export const blankOperationType = {
    "name": "  ",
    "desc": "  "
} as OperationType;

export const operationTypes = [distribution, cleaning, accessControl, reception, facilityMang, greenOffice, 
    concierge, meeting, recycle];
