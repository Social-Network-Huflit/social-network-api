import { Field, ObjectType } from 'type-graphql';
import { User } from '../../Models/User';
import FieldError from '../FieldError';
import MutationResponse from './MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class UserMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field({ nullable: true })
    user?: User;
}
