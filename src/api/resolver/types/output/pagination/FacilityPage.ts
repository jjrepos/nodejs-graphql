import { ObjectType } from "type-graphql";
import Page from "../../../../model/Page";
import { Facility } from "../../../../model/Facility";

@ObjectType()
export class FacilityPage extends Page(Facility){

}