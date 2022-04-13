import { ClassType } from "class-transformer/ClassTransformer";
import { ObjectType, Field, Int } from "type-graphql";

export default function Page<TItem>(TItemClass: ClassType<TItem>){

    @ObjectType({ isAbstract: true })
    abstract class Page {

        @Field(type => [TItemClass])
        items: TItem[];

        @Field(type => Int)
        total: number;

        @Field()
        hasMore: boolean;
    }

    return Page;
}