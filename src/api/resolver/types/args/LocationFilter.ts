import { Field, InputType } from "type-graphql"; //InputType

@InputType()
export class LocationFilter {

    @Field(type => Number, { nullable: false })
    longitude: number;

    @Field(type => Number, { nullable: false })
    latitude: number;
    
    @Field(type => Number, { nullable: false })
    distance: number;

}