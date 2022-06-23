import {
    Collection,
    CollectionDetail,
    Message,
    Notify,
    Post,
    PostComment,
    PostReplyComment,
    PostShare,
    PostShareComment,
    User,
} from '../../Entities';
import { FieldError } from '..';
import { ClassType, Field, InterfaceType, ObjectType } from 'type-graphql';

@InterfaceType()
@ObjectType('MutationResponse')
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

@ObjectType({
    implements: IMutationResponse,
})
export class UserMutationResponse extends MutationResponse(User, 'user') {
    @Field({ nullable: true })
    token?: string;
}

@ObjectType({
    implements: IMutationResponse,
})
export class PostMutationResponse extends MutationResponse(Post, 'post') {}

@ObjectType({
    implements: IMutationResponse,
})
export class CommentMutationResponse extends MutationResponse(PostComment, 'comment') {}

@ObjectType({
    implements: IMutationResponse,
})
export class ReplyCommentMutationResponse extends MutationResponse(
    PostReplyComment,
    'reply_comment'
) {}

@ObjectType({
    implements: IMutationResponse,
})
export class PostShareMutationResponse extends MutationResponse(PostShare, 'post') {}

@ObjectType({
    implements: IMutationResponse,
})
export class CommentPostShareMutationResponse extends MutationResponse(
    PostShareComment,
    'comment'
) {}

@ObjectType({
    implements: IMutationResponse,
})
export class ReplyCommentPostShareMutationResponse extends MutationResponse(
    PostReplyComment,
    'reply_comment'
) {}

@ObjectType({
    implements: IMutationResponse,
})
export class MessageMutationResponse extends MutationResponse(Message, 'chat_message') {}

@ObjectType({
    implements: IMutationResponse,
})
export class NotifyMutationResponse extends MutationResponse(Notify, 'notification') {}

@ObjectType({
    implements: IMutationResponse,
})
export class CollectionMutationResponse extends MutationResponse(Collection, 'collection') {}

@ObjectType({
    implements: IMutationResponse,
})
export class CollectionDetailMutationResponse extends MutationResponse(
    CollectionDetail,
    'detail'
) {}
