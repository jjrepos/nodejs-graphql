import { getModelForClass, modelOptions, mongoose, prop as Property, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { TransportationInput } from "../resolver/types/input/TransportationInput";
import { Address } from "./Address";
import { Facility } from "./Facility";
import { OperationalHours } from "./OperationalHours";
import { TransportationType } from "./TransportationType";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Transportation {
    _id: ObjectId;

    @Property({ nullable: false })
    type!: TransportationType;

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

    @Property({ nullable: true, required: false })
    imageUrl?: string;

    @Property({ nullable: true, _id: false, type: Address })
    address?: Address;

    @Property({ nullable: false, _id: false, Kind: Array, type: OperationalHours })
    operationalHours?: OperationalHours[];

    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withIdInput(id: string, input: TransportationInput, type?: TransportationType): Transportation {
        let transportation = Transportation.withInput(input, type);
        try {
            transportation._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return transportation;
    }

    static withInput(input: TransportationInput, type?: TransportationType): Transportation {
        let transportation = new Transportation();
        if (type) {
            transportation.type = type;
        }
        transportation.facility = input.facility;
        transportation.desc = input.desc;
        transportation.email = input.email;
        transportation.phone = input.phone;
        transportation.url = input.url;
        transportation.onsite = input.onsite;
        transportation.address = input.address;
        transportation.imageUrl = input.imageUrl;
        if(input.operationalHours) {
            transportation.operationalHours = input.operationalHours.map((operationalHour) => { return OperationalHours.withInput(operationalHour); });
        }
        return transportation;
    }
}

export const TransportationModel = getModelForClass(Transportation);   