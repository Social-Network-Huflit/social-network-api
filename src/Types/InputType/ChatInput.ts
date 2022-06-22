import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateMessageInput {
    @Field(() => ID, { nullable: true })
    to_id: number;

    @Field()
    content: string;

    @Field(() => ID, { nullable: true })
    room_id: number;
}
