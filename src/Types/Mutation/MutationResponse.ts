import { ClassType, Field, InterfaceType, ObjectType } from 'type-graphql';
import { User } from '../../Entities';
import FieldError from './FieldError';

@InterfaceType()
export abstract class IMutationResponse {
    @Field()
    code!: number;

    @Field()
    success!: boolean;

    @Field()
    message!: string;

    @Field((_return) => [FieldError], { nullable: true })
    errors?: FieldError[];
}

function MutationResponse<T extends ClassType>(ModelClass: T) {
    const className = ModelClass.name;

    @ObjectType(`${className}MutationResponse`, {
        implements: IMutationResponse,
    })
    class ModelMutationResponse implements IMutationResponse {
        code: number;
        success: boolean;
        message: string;
        errors?: FieldError[] | undefined;

        @Field(() => ModelClass, {
            name: `${className.toLocaleLowerCase()}`,
            nullable: true,
        })
        result?: any;
    }

    return ModelMutationResponse;
}

@ObjectType()
export class UserMutationResponse extends MutationResponse(User){
    @Field({nullable: true})
    token?: string;
}