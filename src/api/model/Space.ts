import { getModelForClass, modelOptions, mongoose, prop as Property, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { SpaceInput } from "../resolver/types/input/SpaceInput";
import { SpaceType } from "./SpaceType";
import { Facility } from "./Facility";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
export class Space {
    _id: ObjectId;

    @Property({ nullable: false })
    type!: SpaceType;

    @Property({ ref: Facility, nullable: false, type: mongoose.Schema.Types.String })
    facility?: Ref<Facility>;

    @Property({ nullable: false })
    desc: string;

    @Property({ nullable: false, type: mongoose.Schema.Types.Date })
    createdAt!: Date;

    @Property({ nullable: true, type: mongoose.Schema.Types.Date })
    updatedAt?: Date;

    static withIdInput(id: string, input: SpaceInput, type?: SpaceType): Space {
        let space = Space.withInput(input, type);
        try {
            space._id = new ObjectId(id);
        } catch (ex) {
            throw new Error("Incorrect Id format: " + ex);
        }
        return space;
    }

    static withInput(input: SpaceInput, type?: SpaceType): Space {
        let space = new Space();
        if (type) {
            space.type = type;
        }
        space.facility = input.facility;
        space.desc = input.desc;
        
        return space;
    }
}

export const SpaceModel = getModelForClass(Space);   