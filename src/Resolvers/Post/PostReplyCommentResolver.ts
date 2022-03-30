import { PostComment, PostReplyCommentLike, User } from '@Entities';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import PostReplyComment from '../../Entities/Post/PostReplyComment';

@Resolver(() => PostReplyComment)
export default class PostReplyCommentResolver {
    //comment
    @FieldResolver(() => PostComment, { nullable: true })
    async comment(@Root() root: PostReplyComment): Promise<PostComment | undefined | null> {
        return await PostComment.findOne({
            id: root.comment_id,
        });
    }

    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: PostReplyComment): Promise<User | undefined | null> {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //likes
    @FieldResolver(() => [PostReplyCommentLike])
    async likes(@Root() root: PostReplyComment): Promise<PostReplyCommentLike[]> {
        return await PostReplyCommentLike.find({
            reply_comment_id: root.id,
        });
    }
}
