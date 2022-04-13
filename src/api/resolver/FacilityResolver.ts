import { Arg, Mutation, Query, Resolver, Args } from "type-graphql";
import { Facility, FacilityType } from "../model/Facility";
import { FacilityService } from "../service/FacilityService";
import { FacilityInput } from "./types/input/FacilityInput";
import { PaginationArgs } from "./types/args/PaginationArgs";
import { FacilityPage } from "./types/output/pagination/FacilityPage";
import { FacilityFilter } from "./types/args/FacilityFilter";
import { logging } from "../util/log/LogManager";

@Resolver(of => Facility)
export class FacilityResolver {
    private readonly facilityService: FacilityService = new FacilityService();
    private logger = logging.getLogger(FacilityResolver.name);

    @Query(returns => Facility, { nullable: true })
    async facility(@Arg("id", { nullable: false }) id: string): Promise<Facility | void | null> {
        return this.facilityService.getFacility(id);
    }

    @Query(returns => [Facility])
    async allFacilities(@Arg("facilityFilter", { nullable: true }) facilityFilter: FacilityFilter): Promise<Facility[]> {
        this.logger.debug("Resolver classs");
        console.log("Resolver classs console");
       if (!facilityFilter) {
            return this.facilityService.getAllFacilities();
       }

       if (facilityFilter.searchByCampusCodeFacilityType()) {
            return this.facilityService.getAllByCampusCodeFacilityType(facilityFilter.campusCode, facilityFilter.facilityType);
        }
       
        if (facilityFilter.searchByCampusCodeFacilityTypeHotelingSite()) {
            return this.facilityService.getAllByCampusCodeFacilityTypeHotelingSite(facilityFilter.campusCode,
                facilityFilter.facilityType, facilityFilter.hotelingSite);
        }
        
        if (facilityFilter.searchByNearFacilityType()) {
            return this.facilityService.getAllByNearFacilityType(
                facilityFilter.facilityType, facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByCampusCode()) {
            return this.facilityService.getAllByCampusCode(facilityFilter.campusCode);
        }

        if (facilityFilter.searchByFacilityType()) {
            return await this.facilityService.getAllByFacilityType(facilityFilter.facilityType);
        }

        if (facilityFilter.searchByNearFacilityTypeHotelingSite()) {
            return this.facilityService.getAllByNearFacilityTypeHotelingSite(facilityFilter.facilityType, facilityFilter.hotelingSite, 
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByNearHotelingSite()) {
            return this.facilityService.getAllByNearHotelingSite(facilityFilter.hotelingSite, facilityFilter.locationFilter.longitude,
            facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByFacilityTypeHotelingSite()) {
            return this.facilityService.getAllByFacilityTypeHotelingSite(facilityFilter.facilityType, facilityFilter.hotelingSite);
        }

        if (facilityFilter.searchByCampusCodeHotelingSite()) {
            return this.facilityService.getAllByCampusCodeHotelingSite(facilityFilter.campusCode, facilityFilter.hotelingSite);
        }
        
        if (facilityFilter.searchByHotelingSite()) {
            return await this.facilityService.getAllByHotelingSite(facilityFilter.hotelingSite);
        }

        if (facilityFilter.searchByNearCampusCodeHotelingSite()) {
            return this.facilityService.getAllByNearCampusCodeHotelingSite(facilityFilter.campusCode, facilityFilter.hotelingSite, 
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByNearCampusCodeFacilityType()) {
            return this.facilityService.getAllByNearCampusCodeFacilityType(facilityFilter.campusCode, facilityFilter.facilityType, 
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByNearCampusCode()) {
            return this.facilityService.getAllByNearCampusCode( facilityFilter.campusCode, facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }
        
        if (facilityFilter.searchByNear()) {
            return this.facilityService.getAllByNearby(facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

        if (facilityFilter.searchByFacilityTypeNearCampusCodeHotelingSite()) {
            return this.facilityService.getAllByFacilityTypeNearCampusCodeHotelingSite( facilityFilter.facilityType, facilityFilter.campusCode, 
                facilityFilter.hotelingSite, facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
        }

 // new ones
        if (facilityFilter.searchByDateAt()) {
            return this.facilityService.getAllByDateAt( facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByFacilityTypeDateAt()) {
            return this.facilityService.getAllByFacilityTypeDateAt( facilityFilter.facilityType, facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByHotelingSiteDateAt()) {
            return this.facilityService.getAllByHotelingSiteDateAt( facilityFilter.hotelingSite, facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByCampusCodeDateAt()) {
            return this.facilityService.getAllByCampusCodeDateAt( facilityFilter.campusCode, facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByNearDateAt()) {
            return this.facilityService.getAllByNearDateAt(facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance, facilityFilter.getDateAt());
        }

        // three sets
        if (facilityFilter.searchByFacilityTypeHotelingSiteDateAt()) {
            let m =  await this.facilityService.getAllByFacilityTypeHotelingSiteDateAt(facilityFilter.facilityType,
                facilityFilter.hotelingSite, facilityFilter.getDateAt());
                console.log("Total count=" + m.length);
                return m;
        }

        if (facilityFilter.searchByFacilityTypeNearDateAt()) {
            return this.facilityService.getAllByFacilityTypeNearDateAt(facilityFilter.facilityType,
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByHotelingSiteCampusCodeDateAt()) {
            return this.facilityService.getAllByHotelingSiteCampusCodeDateAt(facilityFilter.hotelingSite,
                 facilityFilter.campusCode, facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByCampusCodeNearDateAt()) {
            return this.facilityService.getAllByCampusCodeNearDateAt(facilityFilter.campusCode,
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                facilityFilter.getDateAt());
        }

        // four sets
        if (facilityFilter.searchByFacilityTypeCampusCodeHotelingSiteDateAt()) {
            return this.facilityService.getAllByFacilityTypeCampusCodeHotelingSiteDateAt(facilityFilter.facilityType, facilityFilter.campusCode,
                facilityFilter.hotelingSite, facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByHotelingSiteCampusCodeNearDateAt()) {
            return this.facilityService.getAllByHotelingSiteCampusCodeNearDateAt(facilityFilter.hotelingSite, facilityFilter.campusCode,
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                facilityFilter.getDateAt());
        }
        if (facilityFilter.searchByFacilityTypeCampusCodeNearDateAt()) {
            return this.facilityService.getAllByFacilityTypeCampusCodeNearDateAt(facilityFilter.facilityType, facilityFilter.campusCode,
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                facilityFilter.getDateAt());
        }

        if (facilityFilter.searchByFacilityTypeHotelingSiteCampusCodeNearDateAt()) {
            return this.facilityService.getAllByFacilityTypeHotelingSiteCampusCodeNearDateAt(facilityFilter.facilityType, facilityFilter.campusCode,
                facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                facilityFilter.hotelingSite, facilityFilter.getDateAt());
        }

        // final result
        return this.facilityService.getAllFacilities();
    }


    @Query(returns => FacilityPage)
    async FacilityPages(@Args() { skip, take } : PaginationArgs, @Arg("facilityFilter", { nullable: true }) facilityFilter: FacilityFilter) : Promise<FacilityPage> {
        if(facilityFilter) {
            if (facilityFilter.searchByCampusCodeFacilityType()) {
                return await this.facilityService.getFacilityPagesByCampusCodeFacilityType(skip, take, facilityFilter.campusCode,
                    facilityFilter.facilityType);
            }
           
            if (facilityFilter.searchByCampusCodeFacilityTypeHotelingSite()) {
                return await this.facilityService.getFacilityPagesByCampusCodeFacilityTypeHotelingSite(skip, take, facilityFilter.campusCode,
                    facilityFilter.facilityType, facilityFilter.hotelingSite);
            }
            
            if (facilityFilter.searchByNearFacilityType()) {
                return this.facilityService.getFacilityPagesByNearFacilityType(skip, take,
                    facilityFilter.facilityType, facilityFilter.locationFilter.longitude,
                    facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
    
            if (facilityFilter.searchByCampusCode()) {
                return this.facilityService.getFacilityPagesByCampusCode(skip, take, facilityFilter.campusCode);
            }
    
            if (facilityFilter.searchByFacilityType()) {
                return this.facilityService.getFacilityPagesByFacilityType(skip, take, facilityFilter.facilityType);
            }
    
            if (facilityFilter.searchByNearFacilityTypeHotelingSite()) {
                return this.facilityService.getFacilityPagesByNearFacilityTypeHotelingSite(skip, take, facilityFilter.facilityType, facilityFilter.hotelingSite, 
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
    
            if (facilityFilter.searchByNearHotelingSite()) {
                return this.facilityService.getFacilityPagesByNearHotelingSite(skip, take, facilityFilter.hotelingSite, facilityFilter.locationFilter.longitude,
                facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
    
            if (facilityFilter.searchByFacilityTypeHotelingSite()) {
                return this.facilityService.getFacilityPagesByFacilityTypeHotelingSite(skip, take, facilityFilter.facilityType, facilityFilter.hotelingSite);
            }
    
            if (facilityFilter.searchByCampusCodeHotelingSite()) {
                return this.facilityService.getFacilityPagesByCampusCodeHotelingSite(skip, take, facilityFilter.campusCode, facilityFilter.hotelingSite);
            }
            
            if (facilityFilter.searchByHotelingSite()) {
                return this.facilityService.getFacilityPagesByHotelingSite(skip, take, facilityFilter.hotelingSite);
            }
    
            if (facilityFilter.searchByNearCampusCodeHotelingSite()) {
                return this.facilityService.getFacilityPagesByNearCampusCodeHotelingSite(skip, take, facilityFilter.campusCode, facilityFilter.hotelingSite, 
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
    
            if (facilityFilter.searchByNearCampusCodeFacilityType()) {
                return this.facilityService.getFacilityPagesByNearCampusCodeFacilityType(skip, take, facilityFilter.campusCode, facilityFilter.facilityType, 
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
    
            if (facilityFilter.searchByNearCampusCode()) {
                return this.facilityService.getFacilityPagesByNearCampusCode(skip, take, facilityFilter.campusCode, facilityFilter.locationFilter.longitude,
                    facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }
            
            if (facilityFilter.searchByNear()) {
                return  this.facilityService.getFacilityPagesByNear(skip, take, facilityFilter.locationFilter.longitude,
                    facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
                    
            }
    
            if (facilityFilter.searchByFacilityTypeNearCampusCodeHotelingSite()) {
                return this.facilityService.getFacilityPagesByFacilityTypeNearCampusCodeHotelingSite(skip, take, facilityFilter.facilityType, facilityFilter.campusCode, 
                    facilityFilter.hotelingSite, facilityFilter.locationFilter.longitude,
                    facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance);
            }

            // new ones
            
            if (facilityFilter.searchByDateAt()) {
                return this.facilityService.getFacilityPagesByDateAt(skip, take, facilityFilter.getDateAt());
                                            
            }
           
            if (facilityFilter.searchByFacilityTypeDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeDateAt(skip, take, facilityFilter.facilityType, facilityFilter.getDateAt());
            }
             
            if (facilityFilter.searchByHotelingSiteDateAt()) {
                return this.facilityService.getFacilityPagesByHotelingSiteDateAt(skip, take, facilityFilter.hotelingSite, facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByCampusCodeDateAt()) {
                return this.facilityService.getFacilityPagesByCampusCodeDateAt(skip, take, facilityFilter.campusCode, facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByNearDateAt()) {
                return this.facilityService.getFacilityPagesByNearDateAt(skip, take, facilityFilter.locationFilter.longitude,
                    facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance, facilityFilter.getDateAt());
            }
    
            // three sets
            if (facilityFilter.searchByFacilityTypeHotelingSiteDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeHotelingSiteDateAt(skip, take, facilityFilter.facilityType,
                    facilityFilter.hotelingSite, facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByFacilityTypeNearDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeNearDateAt(skip, take, facilityFilter.facilityType,
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                    facilityFilter.getDateAt());
            }
            
            if (facilityFilter.searchByHotelingSiteCampusCodeDateAt()) {
                return this.facilityService.getFacilityPagesByHotelingSiteCampusCodeDateAt(skip, take, facilityFilter.hotelingSite,
                     facilityFilter.campusCode, facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByCampusCodeNearDateAt()) {
                return this.facilityService.getFacilityPagesByCampusCodeNearDateAt(skip, take, facilityFilter.campusCode,
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                    facilityFilter.getDateAt());
            }

            // four sets
            if (facilityFilter.searchByFacilityTypeCampusCodeHotelingSiteDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeCampusCodeHotelingSiteDateAt(skip, take, facilityFilter.facilityType, facilityFilter.campusCode,
                    facilityFilter.hotelingSite, facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByHotelingSiteCampusCodeNearDateAt()) {
                return this.facilityService.getFacilityPagesByHotelingSiteCampusCodeNearDateAt(skip, take, facilityFilter.hotelingSite, facilityFilter.campusCode,
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                    facilityFilter.getDateAt());
            }

            if (facilityFilter.searchByFacilityTypeCampusCodeNearDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeCampusCodeNearDateAt(skip, take, facilityFilter.facilityType, facilityFilter.campusCode,
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                    facilityFilter.getDateAt());
            }
    
            if (facilityFilter.searchByFacilityTypeHotelingSiteCampusCodeNearDateAt()) {
                return this.facilityService.getFacilityPagesByFacilityTypeHotelingSiteCampusCodeNearDateAt(skip, take, facilityFilter.facilityType, facilityFilter.campusCode,
                    facilityFilter.locationFilter.longitude, facilityFilter.locationFilter.latitude, facilityFilter.locationFilter.distance,
                    facilityFilter.hotelingSite, facilityFilter.getDateAt());
            }
        }

        return this.facilityService.getFacilityPages(skip, take);
    }

    @Query(returns => [Facility])
    async facilitiesNear(@Arg("longititude", { nullable: false }) longititude: number,
        @Arg("lattitude", { nullable: false }) lattitude: number,
        @Arg("distanceInMiles", { nullable: true }) distance: number = 20,
        @Arg("facilityType", { nullable: false }) facilityType: FacilityType,
        @Arg("hotelingSite", { nullable: false }) hotelingSite: boolean): Promise<Facility[]> {
        return this.facilityService.getFacilitiesNear({ longititude, lattitude, distance, facilityType, hotelingSite});
    }

    @Mutation(returns => Facility)
    async saveFacility(@Arg("input") facilityInput: FacilityInput): Promise<Facility> {
        return await this.facilityService.save(facilityInput);
    }

    @Mutation(returns => Facility)
    async updateFacility(@Arg("input") facilityInput: FacilityInput): Promise<Facility | null> {
        return await this.facilityService.update(facilityInput);
    }

    @Mutation(returns => Boolean)
    async deleteFacility(@Arg("id", {nullable: false}) id: string): Promise<Boolean> {
        return this.facilityService.delete(id);
    }
}