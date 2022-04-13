import { MinLength, ValidateNested, IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
import { AddressInput } from "./AddressInput";
import { LocationInput } from "./LocationInput";
import { OperationalHoursInput } from "./OperationalHoursInput";
import { FacilityType } from "../../../model/Facility";
import { OperationalStatus } from "../../../model/Facility";
import { ClassificationType } from "../../../model/Facility";

@InputType()
export class FacilityInput {
    @MinLength(3)
    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    id!: string;

    @IsDefined()
    @Field({ nullable: true })
    @IsNotEmpty()
    name!: string;

    @MinLength(3)
    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    campusCode!: string;

    @Field(type => AddressInput)
    @ValidateNested()
    address!: AddressInput;

    @Field(type => LocationInput, { nullable: true })
    @ValidateNested()
    location?: LocationInput;

    @MinLength(3)
    //@IsDefined()
    @Field({ nullable: true })
    timeZone: string;

    @IsNotEmpty()
    @IsDefined()
    @Field({ nullable: true })
    hotelingSite!: boolean;

    @Field({ nullable: true })
    requireBadgeToAccessBuilding?: boolean;

    @Field({ nullable: true })
    requireBadgeToAccesSuite?: boolean;

    //@IsNotEmpty()
    //@IsDefined()
    @Field(type => [OperationalHoursInput], { nullable: true })
    @ValidateNested()
    officeHours?: OperationalHoursInput[];

    
    @Field({ nullable: true })
    otherDetail?: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(type => FacilityType, { nullable: true })
    facilityType?: FacilityType;

    @Field(type => OperationalStatus, {  nullable: true  })
    operationalStatus!: OperationalStatus;

    @Field(type => ClassificationType, { nullable: true  })
    classificationType: ClassificationType;
}