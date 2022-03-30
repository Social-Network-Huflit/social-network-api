import {
    Follow,
    Post,
    PostComment,
    PostCommentLike,
    PostLike,
    PostReplyComment,
    PostReplyCommentLike,
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
    User,
} from '@Entities';
import { Authentication } from '@Middlewares/Auth.middleware';
import { Context } from '@Types';
import { Ctx, FieldResolver, Query, Resolver, Root, UseMiddleware } from 'type-graphql';

@Resolver(() => User)
export default class UserResolver {
    //posts
    @FieldResolver(() => [Post])
    async posts(@Root() root: User): Promise<Post[]> {
        return await Post.find({
            user_id: root.id,
        });
    }

    //likes_post
    @FieldResolver(() => [PostLike])
    async likes_post(@Root() root: User): Promise<PostLike[]> {
        return await PostLike.find({
            user_id: root.id,
        });
    }

    //comments_post
    @FieldResolver(() => [PostComment])
    async comments_post(@Root() root: User): Promise<PostComment[]> {
        return await PostComment.find({
            user_id: root.id,
        });
    }

    //likes_comment_post
    @FieldResolver(() => [PostCommentLike])
    async likes_comment_post(@Root() root: User): Promise<PostCommentLike[]> {
        return await PostCommentLike.find({
            user_id: root.id,
        });
    }

    //reply_comments_post
    @FieldResolver(() => [PostReplyComment])
    async reply_comments_post(@Root() root: User): Promise<PostReplyComment[]> {
        return await PostReplyComment.find({
            user_id: root.id,
        });
    }

    //likes_reply_comment_post
    @FieldResolver(() => [PostReplyCommentLike])
    async likes_reply_comment_post(@Root() root: User): Promise<PostReplyCommentLike[]> {
        return await PostReplyCommentLike.find({
            user_id: root.id,
        });
    }

    //posts_share
    @FieldResolver(() => [PostShare])
    async posts_share(@Root() root: User): Promise<PostShare[]> {
        return await PostShare.find({
            user_id: root.id,
        });
    }

    //comments_post_share
    @FieldResolver(() => [PostShareComment])
    async comments_post_share(@Root() root: User): Promise<PostShareComment[]> {
        return await PostShareComment.find({
            user_id: root.id,
        });
    }

    //likes_comment_post_share
    @FieldResolver(() => [PostShareCommentLike])
    async likes_comment_post_share(@Root() root: User): Promise<PostShareCommentLike[]> {
        return await PostShareCommentLike.find({
            user_id: root.id,
        });
    }

    //likes_post_share
    @FieldResolver(() => [PostShareLike])
    async likes_post_share(@Root() root: User): Promise<PostShareLike[]> {
        return await PostShareLike.find({
            user_id: root.id,
        });
    }

    //reply_comments_post_share
    @FieldResolver(() => [PostShareReplyComment])
    async reply_comments_post_share(@Root() root: User): Promise<PostShareReplyComment[]> {
        return await PostShareReplyComment.find({
            user_id: root.id,
        });
    }

    //reply_comments_post_share
    @FieldResolver(() => [PostShareReplyCommentLike])
    async likes_reply_comment_post_share(@Root() root: User): Promise<PostShareReplyCommentLike[]> {
        return await PostShareReplyCommentLike.find({
            user_id: root.id,
        });
    }

    //following
    @FieldResolver(() => [User])
    async following(@Root() root: User): Promise<User[]> {
        const follows = await Follow.find({
            user_1: root.id,
        });

        return follows.map((follow) => follow.following);
    }

    //followers
    @FieldResolver(() => [User])
    async followers(@Root() root: User): Promise<User[]> {
        const follows = await Follow.find({
            user_2: root.id,
        });

        return follows.map((follow) => follow.followers);
    }

    //Get My user
    @UseMiddleware(Authentication)
    @Query(() => User, { nullable: true })
    async getMyUser(@Ctx() { req }: Context): Promise<User | null | undefined> {
        const user = await User.findOne(req.session.userId);
        return user;
    }
}
