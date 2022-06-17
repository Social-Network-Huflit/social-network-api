import { AuthenticationError } from 'apollo-server-core';
import i18n from 'i18n';
import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { In, Like, Not, Raw } from 'typeorm';
import {
    Follow,
    HistorySearch,
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
    Room,
    User,
} from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, UserMutationResponse } from '../../Types';

@Resolver(() => User)
export default class UserResolver {
    //posts
    @FieldResolver(() => [Post])
    async posts(@Root() root: User): Promise<Post[]> {
        return await Post.find({
            user_id: root.id,
        });
    }

    //history
    @FieldResolver(() => [HistorySearch])
    async history(@Root() root: User): Promise<HistorySearch[]> {
        return await HistorySearch.find({
            where: { user_id_1: root.id },
            order: {
                updatedAt: 'DESC',
            },
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
        const result: User[] = [];

        const follows = await Follow.find({
            user_1: root.id,
        });

        for (let i = 0; i < follows.length; i++) {
            const element = follows[i];

            const user = await User.findOne(element.user_2);

            if (user) {
                result.push(user);
            }
        }

        return result;
    }

    //followers
    @FieldResolver(() => [User])
    async followers(@Root() root: User): Promise<User[]> {
        const result: User[] = [];

        const follows = await Follow.find({
            user_2: root.id,
        });

        for (let i = 0; i < follows.length; i++) {
            const element = follows[i];

            const user = await User.findOne(element.user_1);

            if (user) {
                result.push(user);
            }
        }

        return result;
    }

    //isFollowed
    @FieldResolver(() => Boolean)
    async isFollowed(@Root() root: User, @Ctx() { req }: Context): Promise<boolean> {
        const user = await User.getMyUser(req);

        const follow = await Follow.findOne({
            user_1: user.id,
            user_2: root.id,
        });

        return follow != undefined;
    }

    //rooms
    @FieldResolver(() => [Room])
    async rooms(@Root() user: User): Promise<Room[]> {
        return await user.rooms;
    }

    //Get My user
    @UseMiddleware(Authentication)
    @Query(() => User, { nullable: true })
    async getMyUser(@Ctx() { req }: Context): Promise<User | null | undefined> {
        return User.getMyUser(req);
    }

    //Get All User (Test)
    @UseMiddleware(Authentication)
    @Query(() => [User])
    async getAllUser(@Ctx() { req }: Context): Promise<User[]> {
        return await User.find();
    }

    //Follow User
    @UseMiddleware(Authentication)
    @Mutation(() => UserMutationResponse)
    async followUser(
        @Arg('user_id', () => ID) user_id: number,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const myUser = await User.getMyUser(req);
        const followUser = await User.findOne(user_id);

        if (myUser.id === user_id) {
            return {
                code: 400,
                success: false,
                message: i18n.__('USER.FOLLOW_FAIL'),
            };
        }

        if (!followUser) {
            throw new AuthenticationError(i18n.__('AUTH.FIND_USER_FAIL'));
        }

        const existingFollow = await Follow.findOne({
            user_1: myUser.id,
            user_2: followUser.id,
        });

        if (existingFollow) {
            await Follow.remove(existingFollow);

            return {
                code: 200,
                success: true,
                message: i18n.__('USER.UNFOLLOW_SUCCESS'),
            };
        } else {
            const follow = Follow.create({
                user_1: myUser.id,
                user_2: followUser.id,
            });

            await follow.save();

            return {
                code: 201,
                success: true,
                message: i18n.__('USER.FOLLOW_SUCCESS'),
                result: followUser,
            };
        }
    }

    @UseMiddleware(Authentication)
    @Query(() => User)
    async getUserById(
        @Arg('user_id', () => ID) user_id: number,
        @Ctx() { req }: Context
    ): Promise<User> {
        const myUser = await User.getMyUser(req);

        if (myUser.id === user_id) {
            throw new AuthenticationError('Can not get your own profile');
        }

        const user = await User.findOne(user_id);

        if (!user) {
            throw new AuthenticationError('Can not find profile');
        }

        return user;
    }

    @UseMiddleware(Authentication)
    @Query(() => [User])
    async searchUser(@Arg('content') content: string, @Ctx() { req }: Context): Promise<User[]> {
        const myUser = await User.getMyUser(req);

        const users = await User.find({
            where: [
                { username: Raw((alias) => `LOWER(${alias}) LIKE '%${content.toLowerCase()}%'`) },
                { email: Raw((alias) => `LOWER(${alias}) LIKE '%${content.toLowerCase()}%'`) },
                { name: Raw((alias) => `LOWER(${alias}) LIKE '%${content.toLowerCase()}%'`) },
            ],
        });

        return users.filter((user) => user.id !== myUser.id);
    }

    @UseMiddleware(Authentication)
    @Query(() => [User])
    async getSuggestionUser(@Ctx() { req }: Context): Promise<User[]> {
        const myUser = await User.getMyUser(req);

        const follows = await Follow.find({
            user_1: myUser.id,
        });

        const list_id = follows.map((item) => item.user_2).concat(myUser.id);

        const users = await User.find({
            id: Not(In(list_id)),
        });

        return users.slice(0, 10);
    }
}
