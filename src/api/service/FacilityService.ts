import { assert } from "console";
import { Facility, FacilityType, ClassificationType, OperationalStatus } from "../model/Facility";
import { FacilityRepository } from "../repository/FacilityRepository";
import { FacilityRepositoryImpl } from "../repository/FacilityRepositoryImpl";
import { TransportationRepository } from "../repository/TransportationRepository";
import { TransportationRepositoryImpl } from "../repository/TransportationRepositoryImpl";
import { OperationRepository } from "../repository/OperationRepository";
import { OperationRepositoryImpl } from "../repository/OperationRepositoryImpl";

import { SpaceRepository } from "../repository/SpaceRepository";
import { SpaceRepositoryImpl } from "../repository/SpaceRepositoryImpl";
import { AmenityRepository } from "../repository/AmenityRepository";
import { AmenityRepositoryImpl } from "../repository/AmenityRepositoryImpl";
import { NotificationRepository } from "../repository/NotificationRepository";
import { NotificationRepositoryImpl } from "../repository/NotificationRepositoryImpl";
import { StateCodeRepository } from "../repository/StateCodeRepository";
import { StateCodeRepositoryImpl } from "../repository/StateCodeRepositoryImpl";
import { CountryCodeRepository } from "../repository/CountryCodeRepository";
import { CountryCodeRepositoryImpl } from "../repository/CountryCodeRepositoryImpl";

import { Transaction } from "../repository/util/Transaction";
import { OperationalHoursValidator } from "../repository/util/validator/OperationalHoursValidator";
import { AddressValidator } from "../repository/util/validator/AddressValidator";
import { FacilityInput } from "../resolver/types/input/FacilityInput";
import { FacilityPage } from "../resolver/types/output/pagination/FacilityPage";
import { InputStringValidator } from "../repository/util/validator/InputStringValidator";

export class FacilityService {
    private readonly repository: FacilityRepository = new FacilityRepositoryImpl();
    private readonly transportationRepository: TransportationRepository = new TransportationRepositoryImpl();
    private readonly operationRepository: OperationRepository = new OperationRepositoryImpl();
    private readonly amenityRepository: AmenityRepository = new AmenityRepositoryImpl();
    private readonly spaceRepository: SpaceRepository = new SpaceRepositoryImpl();
    private readonly notificationRepository: NotificationRepository = new NotificationRepositoryImpl();
    private readonly stateCodeRepository: StateCodeRepository = new StateCodeRepositoryImpl();
    private readonly countryCodeRepository: CountryCodeRepository = new CountryCodeRepositoryImpl();

    private readonly validator: OperationalHoursValidator = new OperationalHoursValidator();
    private readonly inputStringValidator: InputStringValidator = new InputStringValidator();
    private readonly addressValidator: AddressValidator = new AddressValidator();

    
    async getFacility(code: string): Promise<Facility | null> {
        return await this.repository.findById(code);
    }

    async getFacilitiesNear({ longititude, lattitude, distance = 20, facilityType, hotelingSite }: { longititude: number, lattitude: number, distance?: number,
        facilityType: FacilityType, hotelingSite: boolean }): Promise<Facility[]> {
        return await this.repository.findAllNear(longititude, lattitude, distance, facilityType, hotelingSite);
    }

    async save(input: FacilityInput): Promise<Facility> {
        assert(input);
        let facility = Facility.withInput(input);

        let facilityExists = await this.repository.facilityExists(input.id);
        if (!facilityExists) {
            facility.facilityType = facility.facilityType == undefined ? FacilityType.OFFICE : facility.facilityType;
            facility.classificationType = facility.classificationType == undefined ? ClassificationType.EXPORT_RESTRICTED : facility.classificationType;
            facility.operationalStatus = facility.operationalStatus == undefined ? OperationalStatus.OPEN : facility.operationalStatus;
        }


        let stringError = this.inputStringValidator.validate(facility);
        if (stringError) {
            throw stringError;
        }
        if (facility.officeHours!) {
            let error = this.validator.validate(facility.officeHours!);
            if (error) {
                throw error;
            }
        }

        let addressError = this.addressValidator.validate(facility.address);
        if (addressError) {
            throw addressError;
        }

        if (facility.address.stateCode !== undefined && facility.address.stateCode !== null) {
            let stateCode = await (this.stateCodeRepository.find(facility.address.stateCode));
            if (stateCode !== null) {
                facility.address.state = stateCode.name;
            } else throw new Error (facility.address.stateCode + " is not a valid state code." );
        } 

        let countryCode = await (this.countryCodeRepository.find(facility.address.countryCode));
        if (countryCode !== null) {
            facility.address.country = countryCode.name;
        } else throw new Error (facility.address.countryCode + " is not a valid country code." );
        return await this.repository.save(facility);
    }


    async update(input: FacilityInput): Promise<Facility | null> {
        assert(input);
        assert(input.id);
        let facility = Facility.withInput(input);
        let stringError = this.inputStringValidator.validate(facility);
        if (stringError) {
            throw stringError;
        }
        if (facility.officeHours!) {
            let error = this.validator.validate(facility.officeHours!);
            if (error) {
                throw error;
            }
        }
        let addressError = this.addressValidator.validate(facility.address);
        if (addressError) {
            throw (addressError);
        }

        if (facility.address.stateCode !== undefined &&  facility.address.stateCode !== null && facility.address.stateCode.length == 2) {
            let stateCode = await this.stateCodeRepository.find(facility.address.stateCode);
            if (stateCode !== null) {
                facility.address.state = stateCode.name;
            } else throw new Error (facility.address.stateCode + " is not a valid state code." );
        }

        let countryCode = await this.countryCodeRepository.find(facility.address.countryCode);
        if (countryCode !== null) {
            facility.address.country = countryCode.name;
        } else throw new Error (facility.address.countryCode + " is not a valid country code." );
        
      
        let facilityResponse = await this.repository.update(facility);
        if (facilityResponse) {
            return facilityResponse;
        } else {
            throw new Error("Unable to update facility " + input.id + ". Facility not found.");
        } 
    }

    @Transaction
    async delete(id: string): Promise<Boolean> {
        assert(id);
        await this.transportationRepository.deleteTransportaionForFacility(id);
        await this.operationRepository.deleteOperationForFacility(id);
        await this.amenityRepository.deleteAmenityForFacility(id);
        await this.spaceRepository.deleteSpaceForFacility(id);
        await this.notificationRepository.deleteNotificationForFacility(id);
        
        let facilityResponse = await this.repository.delete(id);
        if (facilityResponse) {
            return Boolean(true);
        } else {
            throw new Error("Unable to delete facility " + id + ". Facility not found.");
        }
    }


    // search facility methods
    async getAllByCampusCodeFacilityTypeHotelingSite(campusCode: string, facilityType: FacilityType, hotelingSite: boolean) {
        return await this.repository.findAllByCampusCodeFacilityTypeHotelingSite(campusCode,
                facilityType, hotelingSite);
    }

    async getAllByCampusCodeFacilityType(campusCode: string, facilityType: FacilityType) {
        return await this.repository.findAllByCampusCodeFacilityType(campusCode, facilityType);
    }

    async getAllByNearFacilityType(facilityType: FacilityType, longitude: number,
        latitude: number, distance: number) {
        return await this.repository.findAllByNearFacilityType(facilityType, longitude, latitude, distance);
    }

    //campusCode
    async getAllByCampusCode(campusCode: string) {
        return await this.repository.findAllByCampusCode(campusCode);
    }

    //facType
    async getAllByFacilityType(facilityType: FacilityType) {
        return await this.repository.findAllByFacilityType(facilityType);
    }

    //facType, Near, hotelingSite
    async getAllByNearFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        return await this.repository.findAllByNearFacilityTypeHotelingSite(facilityType, hotelingSite, longitude, latitude, distance);
    }

    //hotelingSite, Near
    async getAllByNearHotelingSite(hotelingSite: boolean, longitude: number,
            latitude: number, distance: number) {
        return await this.repository.findAllByNearHotelingSite(hotelingSite, longitude,latitude, distance);
    }

    //hotelingSite, facType
    async getAllByFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean) {
        return await this.repository.findAllByFacilityTypeHotelingSite(facilityType, hotelingSite);
    }

    //hotelingSite, campusCode
    async getAllByCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean) {
        return await this.repository.findAllByCampusCodeHotelingSite(campusCode, hotelingSite);
    }

    //hotelingSite
    async getAllByHotelingSite(hotelingSite: boolean) {
        return await this.repository.findAllByHotelingSite(hotelingSite);
    }

    //campusCode, Near, hotelingSite
    async getAllByNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        return await this.repository.findAllByNearCampusCodeHotelingSite(
            campusCode, hotelingSite, longitude, latitude, distance);
    }

    //campusCode, Near, facType
    async getAllByNearCampusCodeFacilityType(campusCode: string, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number) {
        return await this.repository.findAllByNearCampusCodeFacilityType(
            campusCode, facilityType, longitude, latitude, distance);
    }

    //campusCode, Near
    async getAllByNearCampusCode(campusCode: string, longitude: number, latitude: number, distance: number){
        return await this.repository.findAllByNearCampusCode(campusCode, longitude,latitude, distance);
    }

    //Near
    async getAllByNearby(longitude: number, latitude: number, distance: number) {
        return await this.repository.findAllByNearby(longitude, latitude, distance);
    }

    //facType, Near, hotelingSite, campusCode
    async getAllByFacilityTypeNearCampusCodeHotelingSite(facilityType: FacilityType, campusCode: string, 
        hotelingSite: boolean, longitude: number, latitude: number, distance: number) {
        return await this.repository.findAllByFacilityTypeNearCampusCodeHotelingSite(
            facilityType, campusCode, hotelingSite, longitude, latitude, distance);
    }


    async getAllFacilities() {
        return await this.repository.findAll()
    }

    // new ones
    async getAllByDateAt(dateAt: Date) {
        return await this.repository.findAllByDateAt(dateAt);
    }

    async getAllByFacilityTypeDateAt(facilityType: FacilityType, dateAt: Date) {
        return await this.repository.findAllByFacilityTypeDateAt(facilityType, dateAt);
    }

    async getAllByHotelingSiteDateAt(hotelingSite: boolean, dateAt: Date) {
        return await this.repository.findAllByHotelingSiteDateAt(hotelingSite, dateAt);
    }

    async getAllByCampusCodeDateAt(campusCode: string, dateAt: Date) {
        return await this.repository.findAllByCampusCodeDateAt(campusCode, dateAt);
    }

    async getAllByNearDateAt(longitude: number, latitude: number, distance: number, dateAt: Date) {
        return await this.repository.findAllByNearDateAt(longitude, latitude, distance, dateAt);
    }

    // three sets
    async getAllByFacilityTypeHotelingSiteDateAt(facilityType: FacilityType, hotelingSite: boolean, dateAt: Date) {
        return await this.repository.findAllByFacilityTypeHotelingSiteDateAt(facilityType, hotelingSite, dateAt);
    }

    async getAllByFacilityTypeNearDateAt(facilityType: FacilityType,
        longitude: number, latitude: number, distance: number, dateAt: Date) {
            return await this.repository.findAllByFacilityTypeNearDateAt(facilityType, longitude, latitude, distance, dateAt);
    }

    async getAllByHotelingSiteCampusCodeDateAt(hotelingSite: boolean, campusCode: string, dateAt: Date ) {
        return await this.repository.findAllByHotelingSiteCampusCodeDateAt(hotelingSite, campusCode, dateAt);
    }

    async getAllByCampusCodeNearDateAt(campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date) {
        return await this.repository.findAllByCampusCodeNearDateAt(campusCode, longitude, latitude, distance, dateAt);
    }

    async getAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityType: FacilityType, campusCode: string,
        hotelingSite: boolean, dateAt: Date) {
            return await this.repository.findAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityType, campusCode, hotelingSite, dateAt);
    }

    async getAllByHotelingSiteCampusCodeNearDateAt(hotelingSite: boolean, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date) {
            return await this.repository.findAllByHotelingSiteCampusCodeNearDateAt(hotelingSite, campusCode, longitude, latitude, distance, dateAt);
    }

    async getAllByFacilityTypeCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date) {
            return await this.repository.findAllByFacilityTypeCampusCodeNearDateAt(facilityType, campusCode, longitude, latitude, distance, dateAt);
    }

    async getAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date) {
            return await this.repository.findAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityType, campusCode, longitude, latitude, distance, hotelingSite, dateAt);
    }

    ////========================================================
    //Paging methods
    async getFacilityPages(skip: number, take: number): Promise<FacilityPage> {
        let count: number = await this.repository.getFacilitiesCount();
        let result = await this.repository.getSlicedFacilities(skip, take);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType): Promise<FacilityPage> {
        let count: number = await this.repository.getFacilitiesCountByCampusCodeFacilityType(campusCode, facilityType);
        let result = await this.repository.getSlicedFacilitiesByCampusCodeFacilityType(skip, take, campusCode, facilityType);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearFacilityType(skip: number, take: number, facilityType: FacilityType, longitude: number, latitude: number, distance: number): Promise<FacilityPage> {
        let count: number = await this.repository.getFacilitiesCountByNearFacilityType(facilityType, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearFacilityType(skip, take, facilityType, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }
    
    async getFacilityPagesByCampusCodeFacilityTypeHotelingSite(skip: number, take: number, campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<FacilityPage> {
        let count: number = await this.repository.getFacilitiesCountByCampusCodeFacilityTypeHotelingSite(campusCode, facilityType, hotelingSite);
        let result = await this.repository.getSlicedFacilitiesByCampusCodeFacilityTypeHotelingSite(skip, take, campusCode, facilityType, hotelingSite);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByCampusCode(skip: number, take: number, campusCode: string) {
        let count: number = await this.repository.getFacilitiesCountByCampusCode(campusCode);
        let result = await this.repository.getSlicedFacilitiesByCampusCode(skip, take, campusCode);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityType(skip: number, take: number, facilityType: FacilityType) {
        let count: number = await this.repository.getFacilitiesCountByFacilityType(facilityType);
        let result = await this.repository.getSlicedFacilitiesByFacilityType(skip, take, facilityType);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearFacilityTypeHotelingSite(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNearFacilityTypeHotelingSite(facilityType, hotelingSite, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearFacilityTypeHotelingSite(skip, take, facilityType, hotelingSite, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearHotelingSite(skip: number, take: number, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNearHotelingSite(hotelingSite, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearHotelingSite(skip, take, hotelingSite, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityTypeHotelingSite(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean) {
        let count: number = await this.repository.getFacilitiesCountByFacilityTypeHotelingSite(facilityType, hotelingSite);
        let result = await this.repository.getSlicedFacilitiesByFacilityTypeHotelingSite(skip, take, facilityType, hotelingSite);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean) {
        let count: number = await this.repository.getFacilitiesCountByCampusCodeHotelingSite(campusCode, hotelingSite);
        let result = await this.repository.getSlicedFacilitiesByCampusCodeHotelingSite(skip, take, campusCode, hotelingSite);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByHotelingSite(skip: number, take: number, hotelingSite: boolean) {
        let count: number = await this.repository.getFacilitiesCountByHotelingSite(hotelingSite);
        let result = await this.repository.getSlicedFacilitiesByHotelingSite(skip, take, hotelingSite);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNearCampusCodeHotelingSite(campusCode, hotelingSite, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearCampusCodeHotelingSite(skip, take, campusCode, hotelingSite, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNearCampusCodeFacilityType(campusCode, facilityType, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearCampusCodeFacilityType(skip, take, campusCode, facilityType, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNearCampusCode(skip: number, take: number, campusCode: string, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNearCampusCode(campusCode, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNearCampusCode(skip, take, campusCode, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByNear(skip: number, take: number, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByNear(longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByNear(skip, take, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityTypeNearCampusCodeHotelingSite(skip: number, take: number, facilityType: FacilityType, campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number) {
        let count: number = await this.repository.getFacilitiesCountByFacilityTypeNearCampusCodeHotelingSite(campusCode, hotelingSite, facilityType, longitude, latitude, distance);
        let result = await this.repository.getSlicedFacilitiesByFacilityTypeNearCampusCodeHotelingSite(skip, take, campusCode, hotelingSite, facilityType, longitude, latitude, distance);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    // new ones for pagination


    async getFacilityPagesByDateAt(skip: number, take: number, dateAt: Date) {
        let count: number = (await this.repository.findAllByDateAt(dateAt)).length;
        let result = await this.repository.getSlicedFacilitiesByDateAt(skip, take, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

  
    async getFacilityPagesByFacilityTypeDateAt(skip: number, take: number, facilityType: FacilityType, dateAt: Date) {
        let count: number = (await this.repository.findAllByFacilityTypeDateAt(facilityType, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeDateAt(skip, take, facilityType, dateAt)
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

     
    async getFacilityPagesByHotelingSiteDateAt(skip: number, take: number, hotelingSite: boolean, dateAt: Date) {
        let count: number = (await this.repository.findAllByHotelingSiteDateAt(hotelingSite, dateAt)).length;
        let result = await this.repository.getFacilityPagesByHotelingSiteDateAt(skip, take,hotelingSite, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

   
    async getFacilityPagesByCampusCodeDateAt(skip: number, take: number, campusCode: string, dateAt: Date) {
        let count: number = (await this.repository.findAllByCampusCodeDateAt(campusCode, dateAt)).length;
        let result = await this.repository.getFacilityPagesByCampusCodeDateAt(skip, take, campusCode, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

     
    async getFacilityPagesByNearDateAt(skip: number, take: number, longitude: number, latitude: number, distance: number, dateAt: Date) {
        let count: number = (await this.repository.findAllByNearDateAt(longitude, latitude, distance, dateAt)).length;
        let result = await this.repository.getFacilityPagesByNearDateAt(skip, take, longitude, latitude, distance, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    // three sets
    async getFacilityPagesByFacilityTypeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean, dateAt: Date) {
        let count: number = (await this.repository.findAllByFacilityTypeHotelingSiteDateAt(facilityType, hotelingSite, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeHotelingSiteDateAt(skip, take, facilityType, hotelingSite, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityTypeNearDateAt(skip: number, take: number, facilityType: FacilityType,
            longitude: number, latitude: number, distance: number, dateAt: Date) {
        let count: number = ( await this.repository.findAllByFacilityTypeNearDateAt(facilityType, longitude, latitude, distance, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeNearDateAt(skip, take, facilityType, longitude, latitude, distance, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }
 
    async getFacilityPagesByHotelingSiteCampusCodeDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string, dateAt: Date ) {
        let count: number = ( await this.repository.findAllByHotelingSiteCampusCodeDateAt(hotelingSite, campusCode, dateAt)).length;
        let result = await this.repository.getFacilityPagesByHotelingSiteCampusCodeDateAt(skip, take, hotelingSite, campusCode, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByCampusCodeNearDateAt(skip: number, take: number, campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date) {
        let count: number = (await this.repository.findAllByCampusCodeNearDateAt(campusCode, longitude, latitude, distance, dateAt)).length;
        let result = await this.repository.getFacilityPagesByCampusCodeNearDateAt(skip, take, campusCode, longitude, latitude, distance, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityTypeCampusCodeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
            hotelingSite: boolean, dateAt: Date) {
        let count: number = ( await this.repository.findAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityType, campusCode, hotelingSite, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeCampusCodeHotelingSiteDateAt(skip, take, facilityType, campusCode, hotelingSite, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByHotelingSiteCampusCodeNearDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string,
            longitude: number, latitude: number, distance: number, dateAt: Date) {
        let count: number = ( await this.repository.findAllByHotelingSiteCampusCodeNearDateAt(hotelingSite, campusCode, longitude, latitude, distance, dateAt)).length;
        let result = await this.repository.getFacilityPagesByHotelingSiteCampusCodeNearDateAt(skip, take, hotelingSite, campusCode, longitude, latitude, distance, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

    async getFacilityPagesByFacilityTypeCampusCodeNearDateAt(skip: number, take:number, facilityType: FacilityType, campusCode: string,
            longitude: number, latitude: number, distance: number, dateAt: Date) {
        let count: number = ( await this.repository.findAllByFacilityTypeCampusCodeNearDateAt(facilityType, campusCode, longitude, latitude, distance, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeCampusCodeNearDateAt(skip, take, facilityType, campusCode, longitude, latitude, distance, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }
    
    async getFacilityPagesByFacilityTypeHotelingSiteCampusCodeNearDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
            longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date) {
        let count: number = (await this.repository.findAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityType, campusCode, longitude, latitude, distance, hotelingSite, dateAt)).length;
        let result = await this.repository.getFacilityPagesByFacilityTypeHotelingSiteCampusCodeNearDateAt(skip, take, facilityType, campusCode, longitude, latitude, distance, hotelingSite, dateAt);
        return {items: result, total: result.length, hasMore: count - skip > take};
    }

}