import { PostComment, PostReplyCommentLike, User } from '../../Entities';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import PostReplyComment from '../../Entities/Post/PostReplyComment';
import moment from 'moment';
import { Context } from '../../Types';

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

    //like_count
    @FieldResolver(() => Number)
    async like_count(@Root() root: PostReplyComment): Promise<number> {
        return (await this.likes(root)).length;
    }

    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() root: PostReplyComment): string {
        return moment(root.createdAt).fromNow();
    }

    //liked
    @FieldResolver(() => Boolean)
    async liked(@Root() root: PostReplyComment, @Ctx() { req }: Context): Promise<boolean> {
        const user = await User.getMyUser(req);

        const like = await PostReplyCommentLike.findOne({
            reply_comment_id: root.id,
            user_id: user.id,
        });

        return like !== undefined;
    }

    //like_type
    @FieldResolver(() => String, { nullable: true })
    async like_type(
        @Root() root: PostReplyComment,
        @Ctx() { req }: Context
    ): Promise<string | null | undefined> {
        const user = await User.getMyUser(req);

        const like = await PostReplyCommentLike.findOne({
            reply_comment_id: root.id,
            user_id: user.id,
        });

        if (like) return like.like_type;

        return null;
    }
}
