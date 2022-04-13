import { assert } from "console";
import { Facility, FacilityModel, FacilityType } from "../model/Facility";
import { CoordinateType } from "../model/Location";
import { FacilityRepository } from "./FacilityRepository";
import { logging } from "../util/log/LogManager";

export class FacilityRepositoryImpl implements FacilityRepository {
    private logger = logging.getLogger(FacilityRepositoryImpl.name);

    async findById(id: string): Promise<Facility | null> {
        return await FacilityModel.findById(id.toUpperCase()).exec();
    }

    async findAllNear(longititude: number, lattitude: number, distance: number = 20, facilityType: FacilityType = FacilityType.OFFICE,
                      hotelingSite: boolean = true): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
                                    facilityType: facilityType, hotelingSite: hotelingSite }).exec();
    }


    async save(facility: Facility): Promise<Facility> {
        assert(facility);
        let filter = { _id: facility._id.toUpperCase() };
        var st = process.hrtime();
        let result = await FacilityModel.findOneAndUpdate(filter, facility,  { upsert: true, new: true, omitUndefined: true}).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.save: " + elapsedSeconds);
        return result;
    }

    async update(facility: Facility): Promise<Facility | null> {
        assert(facility);
        var st = process.hrtime();
        let result = await FacilityModel.findByIdAndUpdate(facility._id.toUpperCase(), facility, { new: true, omitUndefined: true }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.update: " + elapsedSeconds);
        return result;
    }

    async delete(id: string): Promise<boolean> {
        assert(id);
        let response =  await FacilityModel.findByIdAndDelete({ _id: id.toUpperCase() }).exec();
        return response ? true : false;
    }

    async facilityExists(facilityId: string): Promise<boolean> {
        return await FacilityModel.exists({_id: facilityId ? facilityId.toUpperCase() : facilityId});
    }

    private milesToMeters(miles: number): number {
        return miles ? miles * 1609.344 : 0;
    }

    private milesToRadian(miles: number): number {
        return miles ? miles / 3963.2 : 0;
    }

    //Pagination
    //Count functions
    async getFacilitiesCount(): Promise<number> {
        return await FacilityModel.countDocuments().exec();
    }

    async getFacilitiesCountByCampusCodeFacilityType(campusCode: string, facilityType: FacilityType): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, facilityType: facilityType}).exec();
    }

    async getFacilitiesCountByCampusCodeFacilityTypeHotelingSite(campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, facilityType: facilityType, hotelingSite: hotelingSite}).exec();
    }

    async getFacilitiesCountByNearFacilityType(facilityType: FacilityType = FacilityType.OFFICE, longitude: number, latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({facilityType: facilityType, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByCampusCode(campusCode: string): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode}).exec();
    }

    async getFacilitiesCountByFacilityType(facilityType: FacilityType): Promise<number> {
        return await FacilityModel.countDocuments({facilityType: facilityType}).exec();
    }

    async getFacilitiesCountByNearFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number> {
        return await FacilityModel.countDocuments({facilityType: facilityType, hotelingSite: hotelingSite, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByNearHotelingSite(hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number> {
        return await FacilityModel.countDocuments({hotelingSite: hotelingSite, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByFacilityTypeHotelingSite(facilityType: FacilityType, hotelingSite: boolean): Promise<number> {
        return await FacilityModel.countDocuments({facilityType: facilityType, hotelingSite: hotelingSite}).exec();
    }

    async getFacilitiesCountByCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, hotelingSite: hotelingSite}).exec();
    }

    async getFacilitiesCountByHotelingSite(hotelingSite: boolean): Promise<number> {
        return await FacilityModel.countDocuments({hotelingSite: hotelingSite}).exec();
    }

    async getFacilitiesCountByNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, hotelingSite: hotelingSite, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByNearCampusCodeFacilityType(campusCode: string, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, facilityType: facilityType, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByNearCampusCode(campusCode: string, longitude: number,
        latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByNear(longitude: number,
        latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    async getFacilitiesCountByFacilityTypeNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number): Promise<number>{
        return await FacilityModel.countDocuments({campusCode: campusCode, facilityType: facilityType, hotelingSite: hotelingSite, location: { $geoWithin: { $centerSphere: [[longitude, latitude], this.milesToRadian(distance)] } }}).exec();
    }

    //Slice Functions
    async getSlicedFacilities(skip: number, take: number): Promise<Facility[]> {
        return FacilityModel.find().skip(skip).limit(take);
    }

    async getSlicedFacilitiesByCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType): Promise<Facility[]>{
        return FacilityModel.find({campusCode: campusCode, facilityType: facilityType}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByCampusCodeFacilityTypeHotelingSite(skip: number, take: number, campusCode: string, facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>{
        return FacilityModel.find({campusCode: campusCode, facilityType: facilityType, hotelingSite: hotelingSite}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNearFacilityType(skip: number, take: number, facilityType: FacilityType = FacilityType.OFFICE, longitude: number, latitude: number, distance: number): Promise<Facility[]>{
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return FacilityModel.find({facilityType: facilityType, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByCampusCode(skip: number, take: number,campusCode: string): Promise<Facility[]>{
        return await FacilityModel.find({campusCode: campusCode}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByFacilityType(skip: number, take: number,facilityType: FacilityType): Promise<Facility[]>{
        return await FacilityModel.find({facilityType: facilityType}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNearFacilityTypeHotelingSite(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>{
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({facilityType: facilityType, hotelingSite: hotelingSite, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNearHotelingSite(skip: number, take: number, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>{
            const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({hotelingSite: hotelingSite, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByFacilityTypeHotelingSite(skip: number, take: number,facilityType: FacilityType, hotelingSite: boolean): Promise<Facility[]>{
        return await FacilityModel.find({facilityType: facilityType, hotelingSite: hotelingSite}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByCampusCodeHotelingSite(skip: number, take: number,campusCode: string, hotelingSite: boolean): Promise<Facility[]> {
        return await FacilityModel.find({campusCode: campusCode, hotelingSite: hotelingSite}).skip(skip).limit(take);
    }
    
    async getSlicedFacilitiesByHotelingSite(skip: number, take: number, hotelingSite: boolean): Promise<Facility[]>{
        return await FacilityModel.find({hotelingSite: hotelingSite}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNearCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>{
            const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({campusCode: campusCode, hotelingSite: hotelingSite, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNearCampusCodeFacilityType(skip: number, take: number, campusCode: string, facilityType: FacilityType, longitude: number,
        latitude: number, distance: number): Promise<Facility[]>{
            const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({campusCode: campusCode, facilityType: facilityType, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }
    
    async getSlicedFacilitiesByNearCampusCode(skip: number, take: number, campusCode: string, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>{
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({campusCode: campusCode, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByNear(skip: number, take: number, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>{
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }

    async getSlicedFacilitiesByFacilityTypeNearCampusCodeHotelingSite(skip: number, take: number, campusCode: string, hotelingSite: boolean, facilityType: FacilityType, longitude: number,
    latitude: number, distance: number): Promise<Facility[]>{
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({campusCode: campusCode, hotelingSite: hotelingSite, facilityType: facilityType, location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).skip(skip).limit(take);
    }


    // new cusecases for pagination
    // added more
    async getSlicedFacilitiesByDateAt(skip: number, take: number, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}] }).skip(skip).limit(take);
    }
   
    async getFacilityPagesByFacilityTypeDateAt(skip: number, take: number, facilityType: FacilityType, dateAt: Date) : Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
                facilityType: facilityType }).skip(skip).limit(take);
    }

    async getFacilityPagesByHotelingSiteDateAt(skip: number, take: number, hotelingSite: boolean, dateAt: Date) : Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite }).skip(skip).limit(take);
    }
   
    async getFacilityPagesByCampusCodeDateAt(skip: number, take: number, campusCode: string, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode }).skip(skip).limit(take);
    }

    async getFacilityPagesByNearDateAt(skip: number, take: number, longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).skip(skip).limit(take);
    } 
         
    // three sets
    async getFacilityPagesByFacilityTypeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite, facilityType: facilityType }).skip(skip).limit(take);
    }
   
    async getFacilityPagesByFacilityTypeNearDateAt(skip: number, take: number, facilityType: FacilityType,
            longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            facilityType: facilityType,
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).skip(skip).limit(take);
    }
      
    async getFacilityPagesByHotelingSiteCampusCodeDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite, campusCode: campusCode }).skip(skip).limit(take);
    }
    
    async getFacilityPagesByCampusCodeNearDateAt(skip: number, take: number, campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode,
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).skip(skip).limit(take);
    }
    
    async getFacilityPagesByFacilityTypeCampusCodeHotelingSiteDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
            hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
                campusCode: campusCode, facilityType: facilityType }).skip(skip).limit(take);     
    }
    
    async getFacilityPagesByHotelingSiteCampusCodeNearDateAt(skip: number, take: number, hotelingSite: boolean, campusCode: string,
            longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode, hotelingSite: hotelingSite }).skip(skip).limit(take); 
    }

    async getFacilityPagesByFacilityTypeCampusCodeNearDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
            longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode, facilityType: facilityType }).skip(skip).limit(take); 
    }
                
    async getFacilityPagesByFacilityTypeHotelingSiteCampusCodeNearDateAt(skip: number, take: number, facilityType: FacilityType, campusCode: string,
            longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        return await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            campusCode: campusCode, facilityType: facilityType, hotelingSite }).skip(skip).limit(take);
    }

    ////End of Pagination

    // below are search facility methods

    async findAllByCampusCodeFacilityTypeHotelingSite(campusCode: string, facilityType: FacilityType = FacilityType.OFFICE, 
        hotelingSite: boolean): Promise<Facility[]> {
        return FacilityModel.find({ campusCode: campusCode.toUpperCase(), facilityType: facilityType, hotelingSite: hotelingSite }).exec();
    }

    async findAllByCampusCodeFacilityType(campusCode: string, facilityType: FacilityType = FacilityType.OFFICE): Promise<Facility[]> {
        return FacilityModel.find({ campusCode: campusCode.toUpperCase(), facilityType: facilityType }).exec();
    }

    async findAllByCampusCode(campusCode: string): Promise<Facility[]> {
        return FacilityModel.find({ campusCode: campusCode.toUpperCase() }).exec();
    }

    async findAllByFacilityType(facilityType: FacilityType = FacilityType.OFFICE): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ facilityType: facilityType }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityType: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeHotelingSite(facilityType: FacilityType = FacilityType.OFFICE, 
        hotelingSite: boolean): Promise<Facility[]> {
        return FacilityModel.find({ facilityType: facilityType, hotelingSite: hotelingSite }).exec();
    }

    async findAllByCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean): Promise<Facility[]> {
        return FacilityModel.find({ campusCode: campusCode.toUpperCase(), hotelingSite: hotelingSite }).exec();
    }
//, $or: [{createdAt:{ $gt: dateBy}}, {updatedAt:{ $gt: dateBy}}]
    async findAllByHotelingSite(hotelingSite: boolean): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ hotelingSite: hotelingSite  }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByHotelingSite: " + elapsedSeconds);
        return result;
    }

    async findAllByNearCampusCodeFacilityType(campusCode: string, facilityType: FacilityType = FacilityType.OFFICE,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            campusCode: campusCode.toUpperCase(), facilityType: facilityType}).exec();
    }

    async findAllByNearCampusCode(campusCode: string,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            campusCode: campusCode.toUpperCase()}).exec();
    }

    async findAllByNearby(longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } }}).exec();
    }

    async findAllByNearFacilityType(facilityType: FacilityType = FacilityType.OFFICE,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            facilityType: facilityType}).exec();
    }

    async findAllByNearFacilityTypeHotelingSite(facilityType: FacilityType = FacilityType.OFFICE, hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            facilityType: facilityType,  hotelingSite: hotelingSite}).exec();
    }

    async findAllByNearHotelingSite(hotelingSite: boolean, longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
             hotelingSite: hotelingSite}).exec();
    }

    async findAllByNearCampusCodeHotelingSite(campusCode: string, hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            campusCode: campusCode.toUpperCase(), hotelingSite: hotelingSite}).exec();
    }

    async findAllByFacilityTypeNearCampusCodeHotelingSite( facilityType: FacilityType = FacilityType.OFFICE, campusCode: string, hotelingSite: boolean,
        longititude: number, lattitude: number, distance: number): Promise<Facility[]> { 
        const coordinates = { type: CoordinateType.Point, coordinates: [longititude, lattitude] };
        return FacilityModel.find({ location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            facilityType: facilityType, campusCode: campusCode.toUpperCase(), hotelingSite: hotelingSite}).exec();
    }

    async findAll(): Promise<Facility[]> {
        return FacilityModel.find({ }).exec();
    }

    // added more
    async findAllByDateAt(dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}] }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeDateAt(facilityType: FacilityType, dateAt: Date) : Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
                facilityType: facilityType }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByHotelingSiteDateAt(hotelingSite: boolean, dateAt: Date) : Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByHotelingSiteDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByCampusCodeDateAt(campusCode: string, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByCampusCodeDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByNearDateAt(longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByNearDateAt: " + elapsedSeconds);
        return result;
    }

    // three sets
    async findAllByFacilityTypeHotelingSiteDateAt(facilityType: FacilityType, hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite, facilityType: facilityType }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeHotelingSiteDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeNearDateAt(facilityType: FacilityType,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
            const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
            var st = process.hrtime();
            let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
                facilityType: facilityType,
                location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).exec();
            var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
            this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeNearDateAt: " + elapsedSeconds);
            return result;
    }

    async findAllByHotelingSiteCampusCodeDateAt(hotelingSite: boolean, campusCode: string, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            hotelingSite: hotelingSite, campusCode: campusCode }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByHotelingSiteCampusCodeDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByCampusCodeNearDateAt(campusCode: string,longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode,
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } } }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByCampusCodeNearDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityType: FacilityType, campusCode: string,
        hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
            var st = process.hrtime();
            let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
                campusCode: campusCode, facilityType: facilityType }).exec();
            var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
            this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeCampusCodeHotelingSiteDateAt: " + elapsedSeconds);
            return result;
    }

    async findAllByHotelingSiteCampusCodeNearDateAt(hotelingSite: boolean, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode, hotelingSite: hotelingSite }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByHotelingSiteCampusCodeNearDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, dateAt: Date): Promise<Facility[]> {
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            campusCode: campusCode, facilityType: facilityType }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeCampusCodeNearDateAt: " + elapsedSeconds);
        return result;
    }

    async findAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityType: FacilityType, campusCode: string,
        longitude: number, latitude: number, distance: number, hotelingSite: boolean, dateAt: Date): Promise<Facility[]> {
        const coordinates = { type: CoordinateType.Point, coordinates: [longitude, latitude] };
        var st = process.hrtime();
        let result = await FacilityModel.find({ $or: [{createdAt:{ $gt: dateAt}}, {updatedAt:{ $gt: dateAt}}],
            location: { $near: { $geometry: coordinates, $maxDistance: this.milesToMeters(distance) } },
            campusCode: campusCode, facilityType: facilityType, hotelingSite }).exec();
        var elapsedSeconds = this.parseHRTimeToSeconds(process.hrtime(st));
        this.logger.debug("time taken FacilityRepositoryImpl.findAllByFacilityTypeHotelingSiteCampusCodeNearDateAt: " + elapsedSeconds);
        return result;
    }

    parseHRTimeToSeconds(hrtime: [number, number]): string {
        var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        return seconds;
    }
}