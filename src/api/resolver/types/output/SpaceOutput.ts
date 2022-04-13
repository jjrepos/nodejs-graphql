import { Field, ID, ObjectType } from "type-graphql";
import { Facility } from "../../../model/Facility";
import { Space } from "../../../model/Space";

@ObjectType("Space")
export class SpaceOutput {
    @Field(type => ID)
    id: string;

    @Field({ nullable: false })
    type!: string;

    @Field(type => Facility, { nullable: true })
    facility?: Facility;

    @Field({ nullable: false })
    desc: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;

    static withSpace(space: Space): SpaceOutput {
        let spaceOutput = new SpaceOutput();
        spaceOutput.id = space._id.toHexString();
        spaceOutput.type = space.type.name;
        if (space.facility) {
            spaceOutput.facility = <Facility>space.facility.valueOf();
        }
        spaceOutput.desc = space.desc;
        spaceOutput.createdAt = space.createdAt;
        spaceOutput.updatedAt = space.updatedAt;
        return spaceOutput;
    }
}  