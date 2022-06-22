import { PostShareComment, PostShareReplyComment, PostShareReplyCommentLike, User } from "../../Entities";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "../../Types";
import moment from "moment";

@Resolver(() => PostShareReplyComment)
export default class PostShareReplyCommentResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostShareReplyComment): Promise<User | undefined | null>{
        return await User.findOne({
            id: root.user_id,
        })
    }

    //comment
    @FieldResolver(() => PostShareComment, {nullable: true})
    async comment(@Root() root: PostShareReplyComment): Promise<PostShareComment | undefined | null>{
        return await PostShareComment.findOne({
            id: root.post_share_comment_id,
        })
    }

    //likes
    @FieldResolver(() => [PostShareReplyCommentLike])
    async likes(@Root() root: PostShareReplyComment): Promise<PostShareReplyCommentLike[]>{
        return await PostShareReplyCommentLike.find({
            post_share_reply_comment_id: root.id
        })
    }

    //like_count
    @FieldResolver(() => Number)
    async like_count(@Root() root: PostShareReplyComment): Promise<number> {
        return (await this.likes(root)).length;
    }

    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() root: PostShareReplyComment): string {
        return moment(root.createdAt).fromNow();
    }

    //liked
    @FieldResolver(() => Boolean)
    async liked(@Root() root: PostShareReplyComment, @Ctx() { req }: Context): Promise<boolean> {
        const user = await User.getMyUser(req);

        const like = await PostShareReplyCommentLike.findOne({
            post_share_reply_comment_id: root.id,
            user_id: user.id,
        });

        return like !== undefined;
    }

    //like_type
    @FieldResolver(() => String, { nullable: true })
    async like_type(
        @Root() root: PostShareReplyComment,
        @Ctx() { req }: Context
    ): Promise<string | null | undefined> {
        const user = await User.getMyUser(req);

        const like = await PostShareReplyCommentLike.findOne({
            post_share_reply_comment_id: root.id,
            user_id: user.id,
        });

        if (like) return like.like_type;

        return null;
    }
}