import { Field, InputType } from "type-graphql";

@InputType()
export class CreateMessageInput{
    @Field()
    to_id: number;

    @Field()
    content: string;

    @Field({nullable: true})
    room_id: number;

}