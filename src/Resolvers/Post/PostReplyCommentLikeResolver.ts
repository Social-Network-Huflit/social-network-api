import { PostReplyComment, PostReplyCommentLike, User } from '../../Entities';
import { FieldResolver, Resolver, Root } from 'type-graphql';

@Resolver(() => PostReplyCommentLike)
export default class PostReplyCommentLikeResolver {
    //reply_comment
    @FieldResolver(() => PostReplyComment, {nullable: true})
    async reply_comment(
        @Root() root: PostReplyCommentLike
    ): Promise<PostReplyComment | null | undefined> {
        return await PostReplyComment.findOne({
            id: root.reply_comment_id,
        });
    }

    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostReplyCommentLike): Promise<User | null | undefined> {
        return await User.findOne({
            id: root.user_id,
        });
    }
}
