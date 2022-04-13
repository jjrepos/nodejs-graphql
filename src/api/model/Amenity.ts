import { getModelForClass, mongoose, prop as Property, Ref, modelOptions } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Facility } from "./Facility";
import { Address } from "./Address";
import { OperationalHours } from "./OperationalHours";
import { AmenityType } from "./AmenityType";
import { AmenityInput } from "../resolver/types/input/AmenityInput";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Amenity {
    _id: ObjectId;

    @Property({ nullable: false })
    type!: AmenityType;

    @Property({ ref: Facility, nullable: false, type: mongoose.Schema.Types.String })
    facility?: Ref<Facility>;

    @Property({ nullable: false })
    desc: string;

    @Property({ nullable: true })
    email?: string;

    @Property({ nullable: true })
    phone?: string;

    @Property({ nullable: true })
    url?: string;

    @Property({ nullable: false })
    onsite: boolean;

    @Property({ nullable: true, _id: false, type: Address })
    address?: Address;

    @Property({ nullable: false, _id: false, Kind: Array, type: OperationalHours })
    operationalHours?: OperationalHours[];

    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withIdInput(id: string, input: AmenityInput, type?: AmenityType): Amenity {
        let amenity = Amenity.withInput(input, type);
        try {
            amenity._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return amenity;
    }

    static withInput(input: AmenityInput, type?: AmenityType): Amenity {
        let amenity = new Amenity();
        if(type) {
            amenity.type = type;
        }
        amenity.facility = input.facility;
        amenity.desc = input.desc;
        amenity.email = input.email;
        amenity.phone = input.phone;
        amenity.url = input.url;
        amenity.onsite = input.onsite;
        amenity.address = input.address;
        amenity.operationalHours = input.operationalHours;
        return amenity;
    }
}

export const AmenityModel = getModelForClass(Amenity); 