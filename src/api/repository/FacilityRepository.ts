import { Facility, FacilityType } from "../model/Facility";

export interface FacilityRepository {
    findById(id: string): Promise<Facility | null>;

    findAllNear(longititude: number, lattitude: number, distance: number, facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>;

    save(facility: Facility): Promise<Facility>;

    update(facility: Facility): Promise<Facility | null>;

    delete(id: string): Promise<boolean>;

    facilityExists(facilityId: string): Promise<boolean>;

    //Pagination

        //Count functions
    getFacilitiesCount(): Promise<number>;

    getFacilitiesCountByCampusCodeFacilityType(campusCode: string, facilityType: FacilityType): Promise<number>;

    getFacilitiesCountByCampusCodeFacilityTypeHotelingSite(campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<number>;

    getFacilitiesCountByNearFacilityType(facilityType: FacilityType, longititude: number, lattitude: number, distance: number): Promise<number>;

    getFacilitiesCountByCampusCode(campusCode: string): Promise<number>;

    getFacilitiesCountByFacilityType(facilityType: FacilityType): Promise<number>;

    getFacilitiesCountByNearFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByNearHotelingSite(hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean): Promise<number>;

    getFacilitiesCountByCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean): Promise<number>;

    getFacilitiesCountByHotelingSite(hotelingSite: boolean): Promise<number>;

    getFacilitiesCountByNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByNearCampusCodeFacilityType(campusCode: string, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByNearCampusCode(campusCode: string, longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByNear(longitude: number,
        latitude: number, distance: number): Promise<number>;

    getFacilitiesCountByFacilityTypeNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number): Promise<number>;

        //Slice Functions
    getSlicedFacilities(skip: number, take: number): Promise<Facility[]>;

    getSlicedFacilitiesByCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType): Promise<Facility[]>;

    getSlicedFacilitiesByCampusCodeFacilityTypeHotelingSite(skip: number, take: number, campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>;

    getSlicedFacilitiesByNearFacilityType(skip: number, take: number, facilityType: FacilityType, longititude: number, lattitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByCampusCode(skip: number, take: number,campusCode: string): Promise<Facility[]>;

    getSlicedFacilitiesByFacilityType(skip: number, take: number,facilityType: FacilityType): Promise<Facility[]>;

    getSlicedFacilitiesByNearFacilityTypeHotelingSite(skip: number, take: number,facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByNearHotelingSite(skip: number, take: number, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByFacilityTypeHotelingSite(skip: number, take: number,facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>;

    getSlicedFacilitiesByCampusCodeHotelingSite(skip: number, take: number,campusCode: string, hotelingSite: boolean): Promise<Facility[]>;
    
    getSlicedFacilitiesByHotelingSite(skip: number, take: number, hotelingSite: boolean): Promise<Facility[]>;

    getSlicedFacilitiesByNearCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByNearCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByNearCampusCode(skip: number, take: number, campusCode: string, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByNear(skip: number, take: number, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>;

    getSlicedFacilitiesByFacilityTypeNearCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean, facilityType: FacilityType, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>;

    // new ones for pagination
    getSlicedFacilitiesByDateAt(skip: number, take: number, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByFacilityTypeDateAt(skip: number, take: number, facilityType: FacilityType, dateAt: Date) : Promise<Facility[]>;

    getFacilityPagesByHotelingSiteDateAt(skip: number, take: number, hotelingSite: boolean, dateAt: Date) : Promise<Facility[]>;

    getFacilityPagesByCampusCodeDateAt(skip: number, take: number, campusCode: string, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByNearDateAt(skip: number, take: number, longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByFacilityTypeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByFacilityTypeNearDateAt(skip: number, take: number, facilityType: FacilityType,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByHotelingSiteCampusCodeDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByCampusCodeNearDateAt(skip: number, take: number, campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>;
    
    getFacilityPagesByFacilityTypeCampusCodeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
        hotelingSite: boolean, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByHotelingSiteCampusCodeNearDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>;
    
    getFacilityPagesByFacilityTypeCampusCodeNearDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>;

    getFacilityPagesByFacilityTypeHotelingSiteCampusCodeNearDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date): Promise<Facility[]>;
        
    //End of Pagination

    // search facility methods
    findAllByCampusCodeFacilityTypeHotelingSite(campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>

    findAllByCampusCodeFacilityType(campusCode: string, facilityType: FacilityType): Promise<Facility[]>
    
    findAllByCampusCode(campusCode: string): Promise<Facility[]>
    
    findAllByFacilityType(facilityType: FacilityType): Promise<Facility[]>

    findAllByFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]> 

    findAllByCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean): Promise<Facility[]>

    findAllByHotelingSite(hotelingSite: boolean): Promise<Facility[]>

    findAllByNearCampusCodeFacilityType(campusCode: string, facilityType: FacilityType,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearCampusCode(campusCode: string, longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearby(longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearFacilityType(facilityType: FacilityType,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearHotelingSite(hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> 

    findAllByNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> 
    
    findAllByFacilityTypeNearCampusCodeHotelingSite( facilityType: FacilityType, campusCode: string, hotelingSite:boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]>

    findAll(): Promise<Facility[]>

    // new ones
    findAllByDateAt(dateAt: Date): Promise<Facility[]>

    findAllByFacilityTypeDateAt(facilityType: FacilityType, dateAt: Date) : Promise<Facility[]> 

    findAllByHotelingSiteDateAt(hotelingSite: boolean, dateAt: Date) : Promise<Facility[]>

    findAllByCampusCodeDateAt(campusCode: string, dateAt: Date): Promise<Facility[]>

    findAllByNearDateAt(longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>

    // three sets
    findAllByFacilityTypeHotelingSiteDateAt(facilityType: FacilityType, hotelingSite: boolean, dateAt: Date): Promise<Facility[]>

    findAllByFacilityTypeNearDateAt(facilityType: FacilityType,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>

    
    findAllByHotelingSiteCampusCodeDateAt(hotelingSite: boolean, campusCode: string, dateAt: Date): Promise<Facility[]>

    findAllByCampusCodeNearDateAt(campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>

    findAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityType: FacilityType, campusCode: string,
        hotelingSite: boolean, dateAt: Date): Promise<Facility[]>

    findAllByHotelingSiteCampusCodeNearDateAt(hotelingSite: boolean, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>

    findAllByFacilityTypeCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]>

    findAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date): Promise<Facility[]>
}