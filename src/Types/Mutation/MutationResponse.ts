import { Field, InterfaceType } from 'type-graphql';
import FieldError from '../FieldError';

@InterfaceType()
export default abstract class MutationResponse {
    @Field()
    code!: number;

    @Field()
    success!: boolean;

    @Field()
    message!: string;

    @Field((_return) => [FieldError], { nullable: true })
    errors?: FieldError[];
}
