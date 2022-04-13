import { IsLatitude, IsLongitude, IsNotEmpty, IsDefined } from "class-validator";
import { Field, InputType } from "type-graphql";
import { CoordinateType } from "../../../model/Location";

@InputType()
export class Coordinates {
    @IsLongitude()
    @Field()
    longitude: Number;

    @IsLatitude()
    @Field()
    latitude: Number;
}

@InputType()
export class LocationInput {
    @IsNotEmpty()
    @IsDefined()
    @Field(type => CoordinateType, { defaultValue: CoordinateType.Point, nullable: true })
    type: CoordinateType;


    @IsNotEmpty()
    @IsDefined()
    @Field(type => [Coordinates], { nullable: true })
    coordinates: Coordinates[];
}


