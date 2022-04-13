import { Field, InputType } from "type-graphql";
import { FacilityType } from "../../../model/Facility";
import { LocationFilter } from "./LocationFilter";
import { DateValidator } from "../../../repository/util/validator/DateValidator";

@InputType()
export class FacilityFilter {
    @Field(type => FacilityType, {nullable: true})
    facilityType: FacilityType;

    @Field(type => Boolean, { nullable: true })
    hotelingSite: boolean;

    @Field(type => String, { nullable: true })
    campusCode: string;

    @Field(type => LocationFilter, { nullable: true })
    locationFilter: LocationFilter;

    @Field(type => String, { nullable: true })
    dateAt: string;

    public  getDateAt(): Date {
        return FacilityFilter.checkDate(this.dateAt, "dateAt");
    }

    private static checkDate(inptDateString: string, name: string) : Date {
        let convertedDate = new DateValidator().validate(inptDateString);
        if (convertedDate instanceof Date) {
            if (convertedDate.toString() == "Invalid Date") {
                throw new Error(`${name} should be in format YYYY-MM-ddT00:00:00Z`);
            }
            return convertedDate;
        } else if (convertedDate instanceof Error) {
            throw new Error(`${name} ${convertedDate.message}`);
        }
    }

    // ones
    public searchByCampusCode() {
        return this.campusCode &&
        this.facilityType == undefined && this.hotelingSite == undefined && this.locationFilter == undefined && this.dateAt == undefined;
    }  

    public searchByFacilityType() {
        return this.facilityType  &&
            this.campusCode == undefined && this.hotelingSite == undefined && this.locationFilter == undefined && this.dateAt == undefined;
    }

    public searchByHotelingSite() {
        return this.hotelingSite !== undefined &&
            this.facilityType == undefined && this.campusCode == undefined && this.locationFilter == undefined&& this.dateAt == undefined;
    }

    public searchByNear() {
        return this.locationFilter !== undefined &&
        this.campusCode == undefined && this.facilityType == undefined && this.hotelingSite == undefined && this.dateAt == undefined;
    }

    public searchByDateAt() {
        return this.dateAt !== undefined &&
        this.campusCode == undefined && this.facilityType == undefined && this.hotelingSite == undefined && this.locationFilter == undefined;
    }

    // second sets

    public searchByFacilityTypeHotelingSite() {
        return this.hotelingSite !== undefined && this.facilityType &&
            this.campusCode == undefined && this.locationFilter == undefined && this.dateAt == undefined;
    }

    public searchByCampusCodeFacilityType() {
        return this.campusCode && this.facilityType  &&
            this.hotelingSite == undefined && this.locationFilter == undefined && this.dateAt == undefined;
    }

    public searchByNearFacilityType() {
        return (this.facilityType && this.locationFilter &&
            this.campusCode == undefined && this.hotelingSite == undefined && this.dateAt == undefined ); 
    }

    public searchByFacilityTypeDateAt() {
        return this.dateAt !== undefined  && this.facilityType &&
            this.campusCode == undefined && this.locationFilter == undefined && this.hotelingSite == undefined;
    }

    public searchByCampusCodeHotelingSite() {
        return this.hotelingSite !== undefined && this.campusCode &&
        this.facilityType == undefined && this.locationFilter == undefined && this.dateAt == undefined;
    }

    public searchByNearHotelingSite() {
        return this.hotelingSite !== undefined && this.locationFilter != undefined &&
        this.facilityType == undefined && this.campusCode == undefined && this.dateAt == undefined;
    }

    public searchByHotelingSiteDateAt() {
        return this.hotelingSite !== undefined && this.dateAt !== undefined &&
        this.facilityType == undefined && this.campusCode == undefined && this.locationFilter == undefined;
    }
 
    public searchByNearCampusCode() {
        return this.campusCode && this.locationFilter !== undefined &&
            this.facilityType == undefined && this.hotelingSite == undefined && this.dateAt == undefined;
    }

    public searchByCampusCodeDateAt() {
        return this.campusCode && this.dateAt !== undefined &&
            this.facilityType == undefined && this.hotelingSite == undefined && this.locationFilter == undefined ;
    }

    public searchByNearDateAt() {
        return this.locationFilter !== undefined && this.dateAt !== undefined &&
            this.facilityType == undefined && this.hotelingSite == undefined && this.campusCode == undefined;
    }


    // third sets

    public searchByCampusCodeFacilityTypeHotelingSite() {
        return this.campusCode && this.facilityType && this.hotelingSite!==undefined && 
           this.locationFilter == undefined && this.dateAt == undefined;
    }


    public searchByNearCampusCodeFacilityType() {
        return this.campusCode && this.locationFilter !== undefined && this.facilityType &&
        this.hotelingSite == undefined && this.dateAt == undefined;
    }

    public searchByFacilityTypeHotelingSiteDateAt() {
        return this.facilityType && this.dateAt !== undefined && this.hotelingSite !== undefined &&
        this.campusCode == undefined &&  this.locationFilter == undefined;
    }

    public searchByFacilityTypeNearDateAt() {
        return this.facilityType && this.dateAt !== undefined && this.locationFilter !== undefined &&
        this.campusCode == undefined && this.hotelingSite == undefined;
    }

    public searchByNearCampusCodeHotelingSite() {
        return this.campusCode && this.hotelingSite !== undefined && this.locationFilter !== undefined &&
            this.facilityType == undefined && this.dateAt == undefined; 
    }

    public searchByHotelingSiteCampusCodeDateAt() {
        return this.hotelingSite !== undefined && this.campusCode !== undefined && this.dateAt !== undefined && 
            this.locationFilter == undefined && this.facilityType == undefined; 
    }

    public searchByCampusCodeNearDateAt() {
        return this.campusCode !== undefined && this.locationFilter !== undefined && this.dateAt !== undefined && 
             this.hotelingSite == undefined && this.facilityType == undefined; 
    }

    public searchByNearFacilityTypeHotelingSite() {
        return this.facilityType && this.hotelingSite !== undefined && this.locationFilter != undefined &&
        this.campusCode == undefined;
    }

    // fourth sets to start with
    public searchByFacilityTypeNearCampusCodeHotelingSite() {
        return this.locationFilter !== undefined && this.campusCode && this.facilityType && this.hotelingSite !== undefined &&
            this.dateAt == undefined;
    }

    public searchByFacilityTypeCampusCodeHotelingSiteDateAt() {
        return this.facilityType && this.campusCode && this.hotelingSite !== undefined && this.dateAt !== undefined &&
             this.locationFilter == undefined;
    }

    public searchByHotelingSiteCampusCodeNearDateAt() {
        return this.hotelingSite !== undefined  && this.campusCode && this.locationFilter != undefined && this.dateAt !== undefined &&
              this.facilityType == undefined;
    }

    public searchByFacilityTypeCampusCodeNearDateAt() {
        return this.facilityType !== undefined  && this.campusCode && this.locationFilter != undefined && this.dateAt !== undefined &&
        this.hotelingSite == undefined;
    }

    // fivth set
    public searchByFacilityTypeHotelingSiteCampusCodeNearDateAt() {
        return this.facilityType !== undefined  && this.campusCode && this.locationFilter != undefined && this.dateAt !== undefined &&
        this.hotelingSite !== undefined;
    }



}