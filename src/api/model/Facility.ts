import { getModelForClass, index, mongoose, modelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { FacilityInput } from "../resolver/types/input/FacilityInput";
import { Address } from "./Address";
import { Location } from "./Location";
import { OperationalHours } from "./OperationalHours";

export enum FacilityType {
    OFFICE = "OFFICE",
    EXEC_SUITE = "EXEC_SUITE",
    VIRTUAL_OFFICE = "VIRTUAL_OFFICE",
    WAREHOUSE = "WAREHOUSE",
    STORAGE = "STORAGE",
    DATA_CENTER = "DATA_CENTER",
    OTHER = "OTHER"
}

/*  facility types of inactive status buildings in manhattan
  Parking : "Parking",
  Residential : "Residential",
  Membership_Agreement : "Membership Agreement",
  Facility_Use_Agreeme : "Facility Use Agreeme",
  Mixed_Use_Office_W : "Mixed Use - Office/W",

*/

export enum OperationalStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    PARTIALLY_OPEN = "PARTIALLY_OPEN"
}

export enum ClassificationType {
    EXPORT_RESTRICTED = 'EXPORT_RESTRICTED',
    CLEARED = 'CLEARED',
    UNRESTRICTED = 'UNRESTRICTED'
}

registerEnumType(ClassificationType, {
    name: "ClassificationType",
    description: "Classification type",
});

registerEnumType(OperationalStatus, {
    name: "OperationalStatus",
    description: "Operational Status classification type",
});

registerEnumType(FacilityType, {
    name: "FacilityType",
    description: "Facility classification type",
});

@ObjectType()
@index({ location: "2dsphere" })
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})


export class Facility {

    @Field(type => ID, { name: "id" })
    @Property({ type: mongoose.Schema.Types.String, uppercase: true  })
    _id: string;

    @Field()
    @Property({ required: true })
    name!: string;

    @Field()
    @Property({ required: true, index: true, uppercase: true })
    campusCode: string;

    @Field(type => Address)
    @Property({ required: true, _id: false })
    address!: Address;

    @Field(type => Location, { nullable: true })
    @Property({ nullable: true, _id: false, required: false })
    location?: Location;

    @Field({ nullable: true })
    @Property({ nullable: true, required: false })
    timeZone: string;

    @Field()
    @Property({ required: true })
    hotelingSite!: boolean;

    
    @Field({ nullable: true })
    @Property({ nullable: true, required: false })
    requireBadgeToAccessBuilding?: boolean;

    @Field({ nullable: true })
    @Property({ nullable: true,required: false })
    requireBadgeToAccesSuite?: boolean;

    @Field(type => [OperationalHours], { nullable: true })
    @Property({ nullable: true, _id: false, required: false, Kind: Array, type: OperationalHours })
    officeHours?: OperationalHours[];

    @Field({ nullable: true })
    @Property({ nullable: true, required: false })

    otherDetail?: string;

    @Field({ nullable: true })
    @Property({ nullable: true, required: false })
    imageUrl?: string;

    @Field(itemType => FacilityType)
    @Property({ enum: () => FacilityType, default: () => FacilityType.OFFICE, required: true })
    facilityType: FacilityType;

    //default: () => OperationalStatus.OPEN,
    @Field(itemType => OperationalStatus)
    @Property({ enum: () => OperationalStatus, required: true  })
    operationalStatus!: OperationalStatus;

    @Field(itemType => ClassificationType)
    @Property({ enum: () => ClassificationType, default: () => ClassificationType.EXPORT_RESTRICTED, required: true })
    classificationType: ClassificationType;

    @Field()
    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Field({ nullable: true })
    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withInput(input: FacilityInput): Facility {
        let facility = new Facility();
        facility._id = input.id;
        facility.name = input.name;
        facility.campusCode = input.campusCode;
        facility.timeZone = input.timeZone;

        facility.address = Address.withInput(input.address);
        if (input.location) {
            facility.location = Location.withInput(input.location!);
        } else {
            let location: any = undefined;
            facility.location = location;
        }
        if (input.officeHours) {
            facility.officeHours = input.officeHours.map((officeHours) => { return OperationalHours.withInput(officeHours) });
        } else {
            let officeHours: any = undefined;
            facility.officeHours = officeHours;
        }

        facility.hotelingSite = input.hotelingSite;
        facility.requireBadgeToAccesSuite = input.requireBadgeToAccesSuite
        facility.requireBadgeToAccessBuilding = input.requireBadgeToAccessBuilding;

        facility.otherDetail = input.otherDetail;
        facility.imageUrl = input.imageUrl;

        facility.facilityType = input.facilityType == null ? undefined : input.facilityType;
        facility.classificationType = input.classificationType == null ? undefined : input.classificationType;
        facility.operationalStatus = input.operationalStatus == null ? undefined : input.operationalStatus;

        return facility;
    }

}

export const FacilityModel = getModelForClass(Facility);


  
