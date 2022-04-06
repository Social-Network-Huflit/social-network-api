import { Post, PostComment, PostReplyComment, PostShare, PostShareComment, User } from '../../Entities';
import { FieldError } from '..';
import { ClassType, Field, ObjectType } from 'type-graphql';

@ObjectType()
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

function MutationResponse<T extends ClassType>(ModelClass: T, field: string) {
    const className = ModelClass.name;

    @ObjectType(`${className}MutationResponse`)
    class ModelMutationResponse extends IMutationResponse {
        code: number;
        success: boolean;
        message: string;
        errors?: FieldError[] | undefined;

        @Field(() => ModelClass, {
            name: field,
            nullable: true,
        })
        result?: any;
    }

    return ModelMutationResponse;
}

@ObjectType()
export class UserMutationResponse extends MutationResponse(User, "user") {}

@ObjectType()
export class PostMutationResponse extends MutationResponse(Post, "post") {}

@ObjectType()
export class CommentMutationResponse extends MutationResponse(PostComment, "comment"){}

@ObjectType()
export class ReplyCommentMutationResponse extends MutationResponse(PostReplyComment, "reply_comment"){}

@ObjectType()
export class PostShareMutationResponse extends MutationResponse(PostShare, "post") {}

@ObjectType()
export class CommentPostShareMutationResponse extends MutationResponse(PostShareComment, "comment"){}

@ObjectType()
export class ReplyCommentPostShareMutationResponse extends MutationResponse(PostReplyComment, "reply_comment"){}