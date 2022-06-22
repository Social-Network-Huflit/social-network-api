import { Post, PostComment, PostCommentLike, PostLike, PostReplyComment, User } from '../../Entities';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import moment from 'moment';
import { Context } from '../../Types';

@Resolver(() => PostComment)
export default class PostCommentResolver {
    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: PostComment): Promise<User | null | undefined> {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() root: PostComment): string {
        return moment(root.createdAt).fromNow();
    }

    //liked
    @FieldResolver(() => Boolean, )
    async liked(@Root() root: PostComment, @Ctx() {req}: Context): Promise<boolean> {
        const user = await User.getMyUser(req)

        const like = await PostCommentLike.findOne({
            user_id: user.id,
            comment_id: root.id
        })

        if (like) return true;

        return false;
    }

    //like_type
    @FieldResolver(() => String, {nullable: true} )
    async like_type(@Root() root: PostComment, @Ctx() {req}: Context): Promise<string | undefined | null> {
        const user = await User.getMyUser(req)

        const like = await PostCommentLike.findOne({
            user_id: user.id,
            comment_id: root.id
        })

        if (like) return like.like_type;

        return null;
    }

    //post
    @FieldResolver(() => Post, { nullable: true })
    async post(@Root() root: PostComment): Promise<Post | null | undefined> {
        return await Post.findOne({
            id: root.post_id,
        });
    }

    //likes
    @FieldResolver(() => [PostCommentLike])
    async likes(@Root() root: PostComment): Promise<PostCommentLike[]> {
        return await PostCommentLike.find({
            comment_id: root.id,
        });
    }

    @FieldResolver(() => Number)
    async like_count(@Root() root: PostComment): Promise<number> {
        return (await this.likes(root)).length;
    }

    //reply_comments
    @FieldResolver(() => [PostReplyComment])
    async reply_comments(@Root() root: PostComment): Promise<PostReplyComment[]> {
        return await PostReplyComment.find({
            comment_id: root.id,
        });
    }
}
