import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNotifyInput {
    @Field()
    from_id: number;

    @Field()
    action: string;
    @Field()
    post_id: number;
}
