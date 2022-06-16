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
import { Logger } from '../../Configs';
import { Follow, Post, PostComment, PostLike, PostShare, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import {
    Context,
    CreatePostInput,
    PostMutationResponse,
    PostType,
    ServerInternal,
    UpdatePostInput,
} from '../../Types';
import UpdateEntity from '../../Utils/UpdateEntity';
import ValidateInput from '../../Utils/Validation';
import moment from 'moment';
import shuffleArray from '../../Utils/ShuffleArray';

@Resolver(() => Post)
export default class PostResolver {
    //liked
    @FieldResolver(() => Boolean)
    async liked(@Root() root: Post, @Ctx() { req }: Context): Promise<boolean> {
        const user = await User.getMyUser(req);

        const like = await PostLike.findOne({
            user_id: user.id,
            post_id: root.id,
        });

        return like !== undefined;
    }

    //post_type
    @FieldResolver(() => String)
    post_type() {
        return 'post';
    }

    //like_type
    @FieldResolver(() => String, { nullable: true })
    async like_type(@Root() root: Post, @Ctx() { req }: Context): Promise<string | null> {
        const user = await User.getMyUser(req);

        const like = await PostLike.findOne({
            user_id: user.id,
            post_id: root.id,
        });

        if (!like) {
            return null;
        }

        return like.like_type;
    }

    //post_type
    @FieldResolver(() => String)
    content_type(@Root() root: Post): 'text' | 'images' | 'video' | 'youtube' {
        if (root.image_link) {
            return 'images';
        }

        if (root.video_link) {
            return 'video';
        }

        if (root.youtube_link) {
            return 'youtube';
        }

        return 'text';
    }

    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() post: Post): string {
        return moment(post.createdAt).fromNow();
    }

    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: Post) {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //likes
    @FieldResolver(() => [PostLike])
    async likes(@Root() root: Post): Promise<PostLike[]> {
        return await PostLike.find({
            where: { post_id: root.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    //like_count
    @FieldResolver(() => Number)
    async like_count(@Root() root: Post): Promise<number> {
        return (await this.likes(root)).length;
    }

    //comments
    @FieldResolver(() => [PostComment])
    async comments(@Root() root: Post): Promise<PostComment[]> {
        return await PostComment.find({
            where: { post_id: root.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    //comment_count
    @FieldResolver(() => Number)
    async comment_count(@Root() root: Post): Promise<number> {
        return (await this.comments(root)).length;
    }

    //shares
    @FieldResolver(() => [PostShare])
    async shares(@Root() root: Post): Promise<PostShare[]> {
        return await PostShare.find({
            where: { post_id: root.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    //share_count
    @FieldResolver(() => Number)
    async share_count(@Root() root: Post): Promise<number> {
        return (await this.shares(root)).length;
    }

    @Query(() => Post, { nullable: true })
    async getPost(@Arg('post_id', () => ID) post_id: number): Promise<Post | null | undefined> {
        return await Post.findOne(post_id);
    }

    //Create Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async createPost(
        @Arg('createPostInput') createPostInput: CreatePostInput,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const validate = await ValidateInput(req, createPostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const newPost = Post.create({
                ...createPostInput,
                owner,
            });

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.CREATE_POST_SUCCESS'),
                result: await newPost.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Update Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async updatePost(
        @Arg('updatePostInput') updatePostInput: UpdatePostInput,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const validate = await ValidateInput(req, updatePostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
                id: updatePostInput.id,
                owner,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const updatedPost = await UpdateEntity(Post, post, updatePostInput);

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.UPDATE_POST_SUCCESS'),
                result: updatedPost,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Delete Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async deletePost(
        @Arg('post_id') id: number,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
                id,
                owner,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            await Post.softRemove(post);

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.DELETE_POST_SUCCESS'),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //getPosts
    @UseMiddleware(Authentication)
    @Query(() => [PostType])
    async getPosts(@Ctx() { req }: Context): Promise<(Post | PostShare)[]> {
        const result: (Post | PostShare)[] = [];

        const user = await User.getMyUser(req);

        const myPost = await this.getPostByUser(user.id);

        const followingPost = await this.getFollowingPosts(user.id);

        result.push(...myPost, ...followingPost);

        return result;
    }

    @Query(() => [PostType])
    async getPostByUser(@Arg('user_id', () => ID) user_id: number): Promise<(Post | PostShare)[]> {
        const result: (Post | PostShare)[] = [];

        const myPost = await Post.find({
            where: { user_id },
            order: {
                createdAt: 'DESC',
            },
        });

        const myPostShare = await PostShare.find({
            where: { user_id },
            order: {
                createdAt: 'DESC',
            },
        });

        result.push(...myPost, ...myPostShare);

        return result;
    }

    async getFollowingPosts(user_id: number) {
        const result: (Post | PostShare)[] = [];
        const followings = await Follow.find({
            user_1: user_id,
        });

        for (let i = 0; i < followings.length; i++) {
            const element = followings[i];

            const post = await Post.find({
                where: { user_id: element.user_2 },
                order: {
                    createdAt: 'DESC',
                },
            });

            const postShare = await PostShare.find({
                where: { user_id: element.user_2 },
                order: {
                    createdAt: 'DESC',
                },
            });

            if (post) {
                result.push(...post);
            }

            if (postShare) {
                result.push(...postShare);
            }
        }

        return result;
    }
}
