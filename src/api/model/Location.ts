import { mongoose, prop as Property } from "@typegoose/typegoose";
import { Field, Float, ObjectType, registerEnumType } from "type-graphql";
import { LocationInput } from "../resolver/types/input/LocationInput";


export enum CoordinateType {
    Point = "Point",
    Polygon = "Polygon"
}

registerEnumType(CoordinateType, {
    name: "CoordinateType",
    description: "Location cordinate type",
});

@ObjectType()
export class Location {
    @Field(type => CoordinateType)
    @Property({ enum: () => CoordinateType, required: true, default: () => CoordinateType.Point })
    type: CoordinateType;

    @Field(itemType => [Float])
    @Property({ required: false, nullable: true, kind: Array, type: mongoose.Schema.Types.Number })
    coordinates: Number[];



    static withInput(input: LocationInput): Location {
        let location = new Location();
        let coordinates = new Array();
        if (input.coordinates) {
            input.coordinates.forEach(cordinate => {
                coordinates.push(cordinate.longitude);
                coordinates.push(cordinate.latitude);
            });
        }
        location.type = input.type;
        location.coordinates = coordinates;
        return location;
    }
}






